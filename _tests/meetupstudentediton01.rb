require "date"
require "yaml"

root = File.expand_path("..", __dir__)
source = File.read(File.join(root, "_events/2026-10-18-meetupstudentediton01.md"))
event = YAML.safe_load(source.split(/^---\s*$/, 3)[1], permitted_classes: [Date])
raise "Wrong event date" unless event.fetch("event_date") == Date.new(2026, 10, 18)
raise "Wrong permalink" unless event.fetch("permalink") == "/events/meetupstudentediton01"
raise "Registration must stay closed" if event.key?("registration_url")
raise "Expected four speakers" unless event.fetch("speakers").size == 4
raise "Missing photos must not load" unless event.fetch("speakers").all? { |speaker| speaker["photo"] == false }

site = ARGV.fetch(0, File.join(root, "_site"))
html = File.read(File.join(site, "events/meetupstudentediton01.html"))
raise "Event body not rendered" unless html.include?("Tentang kegiatan") && html.include?("Liputan media")
raise "Contributor heading lost" unless html.include?(">Contributors</h2>")
raise "Merge markers remain" if html.match?(/^(<<<<<<<|=======|>>>>>>>)/)
legacy = File.read(File.join(site, "events/2024-09-15-lmd12.html"))
raise "WebP speaker photos lost" unless legacy.match?(/src="[^\"]*speakers\/[^\"]+\.webp"/)
raise "Legacy speaker layout changed" if legacy.include?("<h3 class=\"font-semibold\">")
event.fetch("speakers").each do |speaker|
  raise "Speaker missing: #{speaker['name']}" unless html.include?(speaker.fetch("name"))
  raise "Campus missing: #{speaker['campus']}" unless html.include?(speaker.fetch("campus"))
end
raise "Unexpected speaker photo" if html.include?("../assets/lombokdev/speakers/")
raise "Unexpected registration link" if html.match?(/href=["'][^"']*\/register\//)
listing = File.read(File.join(site, "events/index.html"))
raise "Event missing from past events" unless listing.split("<!-- Past events -->", 2).fetch(1).include?(event.fetch("title"))
puts "PASS: metadata, four speakers without photos, event body, closed registration, past-event listing"
