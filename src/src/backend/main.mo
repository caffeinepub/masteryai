import List "mo:core/List";
import Array "mo:core/Array";
import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";

actor {
  let maxRecentTopics = 10;
  let recentTopics = List.empty<Text>();

  // Simple persistent cache for Wikipedia content (survives upgrades)
  stable var wikiCache : [(Text, Text)] = [];

  public query func transform(input: OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getCached(topic : Text) : ?Text {
    let key = Text.toLower(topic);
    for ((k, v) in wikiCache.vals()) {
      if (k == key) return ?v;
    };
    null;
  };

  func setCached(topic : Text, content : Text) {
    let key = Text.toLower(topic);
    let filtered = Array.filter<(Text, Text)>(wikiCache, func((k, _)) { k != key });
    wikiCache := Array.append(filtered, [(key, content)]);
  };

  // Encode topic for Wikipedia URL: replace spaces with underscores
  func encodeTopicForWiki(topic : Text) : Text {
    Text.join("_", Text.split(topic, #char ' '));
  };

  public shared ({ caller }) func generateTopicContent(topic : Text) : async Text {
    // 1. Check cache first (includes previously fetched Wikipedia content)
    switch (getCached(topic)) {
      case (?cached) { return cached; };
      case null {};
    };

    // 2. Try primary AI API
    let primaryUrl = "https://icelan.vercel.app/api/topic?topic=" # topic;
    try {
      let result = await OutCall.httpGetRequest(primaryUrl, [], transform);
      if (Text.size(result) > 50) {
        setCached(topic, result);
        return result;
      };
    } catch (_) {};

    // 3. Fallback: self-learn from Wikipedia
    let encoded = encodeTopicForWiki(topic);
    let wikiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" # encoded;
    try {
      let wikiResult = await OutCall.httpGetRequest(wikiUrl, [], transform);
      if (Text.size(wikiResult) > 100) {
        // Tag it so the frontend knows to parse as Wikipedia JSON
        let tagged = "{\"source\":\"wikipedia\",\"raw\":" # wikiResult # "}";
        setCached(topic, tagged);
        return tagged;
      };
    } catch (_) {};

    // 4. Return empty — frontend will use smart fallback
    return "";
  };

  public shared ({ caller }) func chatWithAI(topic : Text, question : Text) : async Text {
    let url = "https://icelan.vercel.app/api/followUp?topic=" # topic # "&question=" # question;
    try {
      await OutCall.httpGetRequest(url, [], transform);
    } catch (_) { "" };
  };

  public query ({ caller }) func getRecentTopics() : async [Text] {
    recentTopics.toArray();
  };

  public shared ({ caller }) func addRecentTopic(topic : Text) : async () {
    let filteredTopics = recentTopics.filter(func(t) { t != topic });
    recentTopics.clear();
    recentTopics.addAll(filteredTopics.values());
    recentTopics.add(topic);
    while (recentTopics.size() > maxRecentTopics) {
      ignore recentTopics.removeLast();
    };
  };
};
