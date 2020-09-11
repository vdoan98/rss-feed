import feedparser

feeds = feedparser.parse("http://rss.cnn.com/rss/cnn_world.rss")

for entry in feeds.entries:
    print(entry.title)
    if 'published' in entry:
        print(entry.published)
    print('\n')