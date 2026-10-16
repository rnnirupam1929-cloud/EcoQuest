const express = require('express');
const RSSParser = require('rss-parser');
const NodeCache = require('node-cache');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rewardService = require('./rewardService');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// RSS Feed Aggregator
const parser = new RSSParser();
const cache = new NodeCache({ stdTTL: 3600 }); // Refresh environmental news hourly
const MAX_ECO_NEWS_ITEMS = 4;

function loadFeeds() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'feeds.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.warn('Could not read feeds.json, falling back to defaults', e.message);
  }
  return [
    { name: 'The Guardian - Environment', url: 'https://www.theguardian.com/environment/rss' },
    { name: 'BBC News - Environment', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
    { name: 'Mongabay', url: 'https://news.mongabay.com/feed/' },
    { name: 'Google News', url: 'https://news.google.com/rss/search?q=climate+OR+environment+OR+sustainability&hl=en-IN&gl=IN&ceid=IN:en' },
  ];
}

async function parseFeedWithTimeout(url) {
  let timeoutId;
  try {
    return await Promise.race([
      parser.parseURL(url),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('RSS feed timed out')), 12000);
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchFeeds() {
  const ecoTopic = /\b(climate|environment|environmental|sustain\w*|eco[- ]friendly|conservation|wildlife|biodivers|renewable|pollution|recycl|emission|carbon|deforestation|ocean|forest|solar|wind energy|green energy|clean energy|ecosystem|earth)\b/i;
  const feeds = loadFeeds();
  const settled = await Promise.allSettled(feeds.map(async feedConfig => {
    const feed = await parseFeedWithTimeout(feedConfig.url);
    return (feed.items || []).map(item => {
      let title = item.title || item.contentSnippet || 'No title';
      let source = feedConfig.name || feed.title || 'Unknown';
      if (source === 'Google News') {
        const match = title.match(/^(.*?)\s+-\s+([^-]+)$/);
        if (match) {
          title = match[1].trim();
          source = match[2].trim();
        }
      }
      const description = item.contentSnippet || item.content || '';
      if (!ecoTopic.test(`${title} ${description}`)) return null;
      const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
      return {
        title,
        link: item.link || item.enclosure?.url || '',
        pubDate: Number.isNaN(new Date(pubDate).getTime()) ? new Date().toISOString() : new Date(pubDate).toISOString(),
        source,
      };
    }).filter(item => item && item.link);
  }));
  const results = settled.flatMap((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    console.warn('Failed to fetch feed', feeds[index].url, result.reason?.message || result.reason);
    return [];
  });
  const unique = new Map();
  results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  for (const item of results) {
    const key = item.title.toLowerCase().replace(/\W/g, '');
    if (!unique.has(key)) unique.set(key, item);
  }
  return [...unique.values()];
}

// ─── News API ──────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  try {
    const cached = cache.get('news');
    if (cached?.length) return res.json({ ok: true, source: 'cache', items: cached.slice(0, MAX_ECO_NEWS_ITEMS) });
    const items = (await fetchFeeds()).slice(0, MAX_ECO_NEWS_ITEMS);
    if (items.length) {
      cache.set('news', items);
      cache.set('news:last-good', items, 7 * 24 * 60 * 60);
      return res.json({ ok: true, source: 'fresh', items });
    }
    const stale = cache.get('news:last-good');
    if (stale?.length) return res.json({ ok: true, source: 'stale-cache', items: stale.slice(0, MAX_ECO_NEWS_ITEMS) });
    return res.status(503).json({ ok: false, error: 'No environmental news feeds are currently available', items: [] });
  } catch (err) {
    console.error('Failed to fetch Eco News', err);
    const stale = cache.get('news:last-good');
    if (stale?.length) return res.json({ ok: true, source: 'stale-cache', items: stale.slice(0, MAX_ECO_NEWS_ITEMS) });
    res.status(500).json({ ok: false, error: 'Failed to fetch news', items: [] });
  }
});

// ─── Rewards API ───────────────────────────────────────────────
// 1. Get all configured rewards and thresholds
app.get('/api/rewards', (req, res) => {
  try {
    const rewards = rewardService.getRewards();
    res.json({ ok: true, rewards });
  } catch (err) {
    console.error('Error fetching rewards:', err);
    res.status(500).json({ ok: false, error: 'Unable to retrieve rewards catalogue' });
  }
});

// 2. Get user claimed rewards and redemption codes
app.get('/api/rewards/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ ok: false, error: 'User identifier is required' });
    }
    const claims = rewardService.getUserClaims(userId);
    res.json({ ok: true, claims });
  } catch (err) {
    console.error('Error fetching user claims:', err);
    res.status(500).json({ ok: false, error: 'Unable to retrieve user claims' });
  }
});

// 3. Claim reward with server-side validation & atomic code generation
app.post('/api/rewards/claim', (req, res) => {
  try {
    const { userId, rewardId, points } = req.body;
    if (!userId || rewardId === undefined || rewardId === null) {
      return res.status(400).json({ ok: false, error: 'Both userId and rewardId are required.' });
    }

    const result = rewardService.claimReward(userId, rewardId, points);
    if (!result.ok) {
      return res.status(result.status || 400).json(result);
    }

    return res.status(result.status || 200).json(result);
  } catch (err) {
    console.error('Error processing reward claim:', err);
    res.status(500).json({ ok: false, error: 'Internal server error processing reward claim.' });
  }
});

// 3a. Redeem a claimed reward, deducting its points exactly once
app.post('/api/rewards/redeem', (req, res) => {
  try {
    const { userId, claimId } = req.body;
    const result = rewardService.redeemReward(userId, claimId);
    if (!result.ok) {
      return res.status(result.status || 400).json(result);
    }
    return res.json(result);
  } catch (err) {
    console.error('Error processing reward redemption:', err);
    res.status(500).json({ ok: false, error: 'Internal server error processing reward redemption.' });
  }
});

// 4. Sync / update authenticated user progress
app.post('/api/user/sync', (req, res) => {
  try {
    const { userId, ...progressData } = req.body;
    if (!userId) {
      return res.status(400).json({ ok: false, error: 'userId is required for sync' });
    }
    const updatedUser = rewardService.syncUserProgress(userId, progressData);
    res.json({ ok: true, user: updatedUser });
  } catch (err) {
    console.error('Error syncing user:', err);
    res.status(500).json({ ok: false, error: 'Failed to sync user data' });
  }
});

// 5. Get user profile and points from server
app.get('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = rewardService.getUser(userId);
    const claims = rewardService.getUserClaims(userId);
    res.json({ ok: true, user, claims });
  } catch (err) {
    console.error('Error getting user data:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve user data' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`EcoQuest Backend Server listening on http://localhost:${port}`));
