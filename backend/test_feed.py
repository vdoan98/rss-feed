import feedparser

feeds = feedparser.parse("http://feeds.bbci.co.uk/news/video_and_audio/entertainment_and_arts/rss.xml")

for entry in feeds.entries:
    print(entry.link)
    if 'image' in entry:
        print(entry.image)
    if 'published' in entry:
        print(entry.published)
    print(entry.title)
    print(entry.description)
    print('\n')