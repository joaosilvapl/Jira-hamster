import Logger from './logger';

const jiraIssueUpdatedStoragePrefix = "jiraIssueUpdated";

export default class JiraIssueInfoRepository {

    constructor(logger) {

        if (!jQuery || !$) {
            throw "jQuery not loaded. Aborting.";
        }

        this.logger = logger;

    }

    addIssueUpdatedToCache = (issueKey) => {
        $.ajax({
            url: "/rest/api/3/issue/" + issueKey + "?fields=updated&expand=changelog",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            success: this.addIssueUpdatedToCacheCallback,
            error: function(response) {
                this.logger.logMessage("Error while loading issue updated date. REST call response: " + response);
            }
        });
    }

    addIssueUpdatedToCacheCallback = (issueData) => {

        if (issueData) {
            this.saveIssueUpdatedToCache(issueData.key, issueData.fields["updated"]);
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