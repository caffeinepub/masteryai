import Nat "mo:core/Nat";
import List "mo:core/List";

import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";


actor {
  let maxRecentTopics = 10;
  let recentTopics = List.empty<Text>();

  public query func transform(input: OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func generateTopicContent(topic : Text) : async Text {
    let url = "https://icelan.vercel.app/api/topic?topic=" # topic;
    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared ({ caller }) func chatWithAI(topic : Text, question : Text) : async Text {
    let url = "https://icelan.vercel.app/api/followUp?topic=" # topic # "&question=" # question;
    await OutCall.httpGetRequest(url, [], transform);
  };

  public query ({ caller }) func getRecentTopics() : async [Text] {
    recentTopics.toArray();
  };

  public shared ({ caller }) func addRecentTopic(topic : Text) : async () {
    // Remove if topic already exists
    let filteredTopics = recentTopics.filter(func(t) { t != topic });
    recentTopics.clear();
    recentTopics.addAll(filteredTopics.values());

    // Add new topic to front
    recentTopics.add(topic);

    // Ensure only the last 10 topics are kept
    while (recentTopics.size() > maxRecentTopics) {
      ignore recentTopics.removeLast();
    };
  };
};
