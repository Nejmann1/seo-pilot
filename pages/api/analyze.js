import axios from 'axios';
import cheerio from 'cheerio';
import keywordExtractor from 'keyword-extractor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    $('script, style, noscript').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    const extraction = keywordExtractor.extract(text, {
      language: 'danish',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });
    const freq = {};
    extraction.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    const keywords = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 10);

    res.status(200).json({
      title,
      titleLength: title.length,
      metaDescription,
      wordCount: text.split(' ').length,
      keywords,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kunne ikke analysere siden' });
  }
}
