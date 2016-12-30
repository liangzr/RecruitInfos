var request = require('request');
var cheerio = require('cheerio');
var scraperjs = require('scraperjs');
var config = require('config-lite');
var _ = require('underscore');
var async = require('async');
var Job = require('../models/job');

log = console.log;
var getJobsFromLagou = function (callback) {
    var maxCompany = 347;
    // jobs = [...Array(maxCompany).keys()]
    jobs = [346, 347]
        .map(function (companyId) {
            return  {
                companyId: companyId,
                positionFirstType: '全部',
                pageNo: 1,
                pageSize: 10
            }
        })
        .map(function (formData) {  
            var 
                compJobs = [];
                totalCount = 20;
            log(formData);
            while(formData * 10 < totalCount){
                request.post({
                    url: config.api.lagou.company, 
                    formData: formData, 
                    function (err, res, rep) {
                    if (err) {
                        return console.error('request error', err);
                    }
                    //处理数据
                    if (rep.content.data.page.totalCount == 0) {
                        return console.log('invaild company...');
                    }
                    log(rep);
                    compJobs.concat(rep.content.data.page.result);
                    totalCount = req.content.data.page.totalCount;
                    formData.pageNo++;
                }});
            }
            return compJobs;
        })
        .map(function (job) {
            scraperjs.StaticScraper
                .create('https://www.lagou.com/jobs/'+ job.positionId +'.html')
                .scrape(function ($) {
                    var desc = $("#job_detail")
                        .find(".job_bt div")
                        .map(function () {
                            return $(this).text();
                        }).get()[0];
                    var addr = $("#job_detail")
                        .find(".word_addr")
                        .map(function () {
                            return $(this).text();
                        }).get();
                    return {
                        desc: desc,
                        addr: addr
                    }
                })
                .then(function (jobDetail) {
                    job.detail = jobDetail;
                });
        });
    callback(jobs);
}
exports.updateJobs = function() {
    async.series([
        function (callback) {
            getJobsFromLagou(function (result) {
                // async.parallel([
                //     function (callback) {
                //         var jobs = _.union()
                //     }
                // ]);
                console.log(result);
            })
        }
    ]);
}
exports.updateJobs();