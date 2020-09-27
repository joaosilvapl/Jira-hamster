import Logger from './logger';

const jiraIssueUpdatedStoragePrefix = "jiraIssueUpdated";

export default class JiraIssueInfoRepository {

    constructor(logger) {

        if (!jQuery || !$) {
            throw "jQuery not loaded. Aborting.";
        }

        this.logger = logger;

    }

    getIssueHistory = (issueKey, loadData, callback) => {

        if (!loadData) {
            this.getIssueUpdatedFromCache(issueKey, (issueKey, value) => {

                if (value) {
                    callback(issueKey, value);
                    return;
                }

                this.getIssueHistoryFromJira(issueKey, callback);

            });
        } else {
            this.getIssueHistoryFromJira(issueKey, callback);
        }

    }

    getIssueHistoryFromJira = (issueKey, callback) => {
        $.ajax({
            url: "/rest/api/3/issue/" + issueKey + "?fields=updated&expand=changelog",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: (issueData) => this.addIssueUpdatedToCacheCallback(issueKey, issueData, callback),
            error: function(response) {
                this.logger.logMessage("Error while loading issue updated date. REST call response: " + response);
            }
        });
    }

    addIssueUpdatedToCacheCallback = (issueKey, issueData, callback) => {

        if (issueData) {

            let lastUpdated = issueData.fields["updated"];

            let historyData = [];

            issueData.changelog.histories.forEach((item) => {
                let author = item.author.displayName;

                if (!historyData.includes(author))
                    historyData.push(author);
            });

            let d = { "lastUpdated": lastUpdated, "historyData": historyData }

            this.saveIssueUpdatedToCache(issueKey, d);

            callback(issueKey, d);
        }
    }

    getCacheKey = (issueKey) => jiraIssueUpdatedStoragePrefix + issueKey;

    saveIssueUpdatedToCache = (issueKey, updated) => {
        let cacheKey = this.getCacheKey(issueKey);

        chrome.storage.sync.set({
            [cacheKey]: updated
        });
    }

    getIssueUpdatedFromCache = (issueKey, callback) => {
        let cacheKey = this.getCacheKey(issueKey);

        chrome.storage.sync.get(cacheKey, (obj) => {
            var value = obj[cacheKey];
            callback(issueKey, value);
        });
    };
}