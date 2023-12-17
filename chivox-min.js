var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(a, b, c) {
    a instanceof String && (a = String(a));
    for (var e = a.length, f = 0; f < e; f++) {
        var d = a[f];
        if (b.call(c, d, f, a))
            return {
                i: f,
                v: d
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, b, c, e) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (e = 0; e < a.length - 1; e++) {
            var f = a[e];
            f in c || (c[f] = {});
            c = c[f]
        }
        a = a[a.length - 1];
        e = c[a];
        b = b(e);
        b != e && null != b && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
;
$jscomp.polyfill("Array.prototype.find", function(a) {
    return a ? a : function(b, a) {
        return $jscomp.findInternal(this, b, a).v
    }
}, "es6", "es3");
chivox = chivox || {};
chivox.AiDebug = function(a) {
    "undefined" == typeof window.console && (window.console = {});
    for (var b = Array.prototype.slice, c = {}, e = 9, f = ["error", "warn", "info", "debug", "log"], d = "assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "), g = d.length, h = []; 0 <= --g; )
        (function(b) {
            c[b] = function() {
                console && (console[b] && console[b].apply(console, arguments) || !0)
            }
        }
        )(d[g]);
    var l = "string" == typeof a ? a : "chivoxAiDebug";
    for (g = f.length; 0 <= --g; )
        (function(a, d) {
            c[d] = function() {
                var c = b.call(arguments)
                  , g = new Date;
                g = g.getHours() + ":" + g.getMinutes() + ":" + g.getSeconds() + "." + g.getMilliseconds();
                c.unshift(g);
                g = [d].concat(c);
                if (console && (0 < e ? e > a : f.length + e <= a)) {
                    try {
                        console.firebug ? console[d].apply(window, c) : console[d] ? console[d](c) : console.log(c)
                    } catch (u) {}
                    h.push(g);
                    g = document.getElementById(l);
                    if (null != g) {
                        var p = g.innerHTML;
                        p += '<div class="aiDebugBlock-' + d + '">';
                        p += '<span class="aiDebug-logType">[' + d + "]</span>";
                        for (var t = c.length, r = 0; r < t; r++)
                            p += '<span class="aiDebug-logText">',
                            p = "object" == typeof c[r] ? p + JSON.stringify(c[r]) : p + c[r],
                            p += "</span>";
                        g.innerHTML = p + "</div>";
                        g.scrollTop = g.scrollHeight || g.offsetTop
                    }
                }
            }
        }
        )(g, f[g]);
    c.setLevel = function(b) {
        e = "number" === typeof b ? b : 9
    }
    ;
    c.getLogs = function() {
        return h
    }
    ;
    c.clear = function() {
        h = [];
        "function" == typeof console.clear && console.clear();
        var b = document.getElementById(l);
        null != b && (b.innerHTML = "")
    }
    ;
    return c
}
;
chivox.AiFlashDetect = function() {
    var a = {
        hasFlash: !1,
        version: "0",
        majorVersion: 0
    }
      , b = swfobject.getFlashPlayerVersion();
    b && 0 != b.major && (a.hasFlash = !0,
    a.version = b.major + "." + b.minor + "." + b.release,
    a.majorVersion = b.major);
    return a
}();
chivox.AiFlot = {
    point: 100,
    draw: function(a) {
        var b = []
          , c = "undefined" != typeof a.autoOffset ? a.autoOffset : !0;
        "undefined" != typeof a.stdData && "" !== a.stdData.tone && "" !== a.stdData.color && b.push(this.__getStdPoint(a.stdData, c));
        "undefined" != typeof a.userData && "" !== a.userData.confidence && "" !== a.userData.color && b.push(this.__getUserPoint(a.userData, c));
        c = a.id;
        0 > a.id.indexOf("#") && (c = "#" + a.id);
        var e = "undefined" != typeof a.width ? a.width : $(c).width();
        a = "undefined" != typeof a.height ? a.height : $(c).height();
        $(c).css({
            width: e,
            height: a
        });
        return $.plot($(c), b, {
            xaxis: {
                min: 0,
                max: 100,
                ticks: []
            },
            yaxis: {
                min: -50,
                max: 50,
                ticks: []
            },
            legend: {
                show: !1
            },
            grid: {
                borderWidth: 0,
                labelMargin: 0
            }
        })
    },
    redraw: function(a, b) {
        var c = []
          , e = "undefined" != typeof b.autoOffset ? b.autoOffset : !0;
        if (null == a)
            return null;
        "undefined" != typeof b.stdData && "" !== b.stdData.tone && "" !== b.stdData.color && c.push(this.__getStdPoint(b.stdData, e));
        "undefined" != typeof b.userData && "" !== b.userData.confidence && "" !== b.userData.color && c.push(this.__getUserPoint(b.userData, e));
        a.setData(c);
        a.draw();
        return a
    },
    __getStdPoint: function(a, b) {
        var c = [];
        b = chivox.AiTone.getStandardCurve(this.point, a.tone, 0, b);
        if (0 == a.tone || "" == a.tone)
            for (var e = 1; e <= this.point / 2; e++)
                c.push([e, b[e - 1]]);
        else
            for (e = 1; e <= this.point; e++)
                c.push([e, b[e - 1]]);
        return {
            data: c,
            color: a.color
        }
    },
    __getUserPoint: function(a, b) {
        var c = [], e = a.confidence, f, d = 0;
        for (f = 0; f < e.length; f++)
            e[f] >= e[d] && (d = f);
        f = a.confidence;
        e = [];
        for (var g = 0; g < f.length; g++)
            e.push(f[g]);
        b = chivox.AiTone.getUserCurve(e, this.point, 0, 0, b);
        e = "number" == typeof a.offset ? a.offset : 30;
        if (0 == d)
            for (f = 1; f <= this.point / 2; f++)
                c.push([f, e + b[f - 1]]);
        else
            for (f = 1; f <= this.point; f++)
                c.push([f, e + b[f - 1]]);
        return {
            data: c,
            color: a.color
        }
    }
};
chivox.AiGChart = {
    point: 100,
    draw: function(a) {
        var b = []
          , c = "undefined" != typeof a.autoOffset ? a.autoOffset : !0;
        "undefined" != typeof a.stdData && "" !== a.stdData.tone && "" !== a.stdData.color && b.push(this.__getStdPoint(a.stdData, c));
        "undefined" != typeof a.userData && "" !== a.userData.confidence && "" !== a.userData.color && b.push(this.__getUserPoint(a.userData, c));
        c = "undefined" != typeof a.width ? a.width : 200;
        for (var e = "undefined" != typeof a.height ? a.height : 200, f = [], d = [], g = 0; g < b.length; g++) {
            d.push(b[g].color.substring(1));
            f[g] = [];
            for (var h = b[g].data.length, l = 0; l < h; l++) {
                var k = parseFloat(b[g].data[l].toFixed(3));
                100 < k && (k = -1);
                f[g].push(k)
            }
            for (l = h; l < this.point; l++)
                f[g].push(-1)
        }
        console.log(f);
        b = "https://chart.googleapis.com/chart?chs=" + c + "x" + e + "&cht=ls&chco=" + d.join(",") + "&chd=t:" + f.join("|") + "&chf=bg,s,ffffff00";
        a = document.getElementById(a.id);
        if (null != a)
            a.innerHTML = '<img src="' + b + '" alt="" />';
        else
            return b;
        return a
    },
    __getStdPoint: function(a, b) {
        var c = [];
        b = chivox.AiTone.getStandardCurve(this.point, a.tone, 50, b);
        if (0 == a.tone || "" == a.tone)
            for (var e = 1; e <= this.point / 2; e++)
                c.push(b[e - 1]);
        else
            for (e = 1; e <= this.point; e++)
                c.push(b[e - 1]);
        return {
            color: a.color,
            data: c
        }
    },
    __getUserPoint: function(a, b) {
        var c = [], e = a.confidence, f, d = 0;
        for (f = 0; f < e.length; f++)
            e[f] >= e[d] && (d = f);
        f = a.confidence;
        e = [];
        for (var g = 0; g < f.length; g++)
            e.push(f[g]);
        b = chivox.AiTone.getUserCurve(e, this.point, 0, 50, b);
        e = "number" == typeof a.offset ? a.offset : 30;
        if (0 == d)
            for (f = 1; f <= this.point / 2; f++)
                c.push(e + b[f - 1]);
        else
            for (f = 1; f <= this.point; f++)
                c.push(e + b[f - 1]);
        return {
            color: a.color,
            data: c
        }
    }
};
chivox.AiPanel = function(a) {
    function b() {
        m.playOff();
        ai$(g.play).unbind("click").click(function() {
            var b = this;
            if (d.player.canPlay || d.params.mode != chivox.MODE.FLASH)
                if (ai$(b).hasClass("playOn"))
                    m.playOff(),
                    d.player.reset();
                else {
                    if ("function" == typeof d.params.onBeforePlay)
                        d.params.onBeforePlay(b);
                    d.resetStatus(b, null, null);
                    m.playOn(b);
                    d.player.load({
                        url: d.params.data.audioUrl,
                        success: function(a, c) {
                            ai$(b).hasClass("playOn") && d.player.play({
                                position: d.params.data.playPosition,
                                duration: d.params.data.playDuration,
                                onStart: function(b, a) {},
                                onStop: function(b, a) {
                                    m.playOff();
                                    if ("function" == typeof d.params.onAfterPlay)
                                        d.params.onAfterPlay()
                                }
                            })
                        }
                    })
                }
            else if (k.open(),
            m.playOff(),
            "function" == typeof d.params.onError)
                d.params.onError("PLAYER_NOT_READY")
        })
    }
    function c(b) {
        if ("" != d.lastRecordId) {
            if ("function" == typeof d.params.onBeforeScore)
                d.params.onBeforeScore(b);
            d.recorder.getScores({
                recordId: d.lastRecordId,
                success: function(a) {
                    if ("" == d.lastRecordId || "undefined" == typeof a[d.lastRecordId]) {
                        if (a.hasOwnProperty("error"))
                            d.params.onScoreError(a.error.id, b)
                    } else {
                        var c = "string" === typeof a[d.lastRecordId] ? a[d.lastRecordId] : JSON.stringify(a[d.lastRecordId])
                          , f = "object" === typeof a[d.lastRecordId] ? a[d.lastRecordId] : JSON.parse(a[d.lastRecordId]);
                        d.scoreData[d.lastRecordId] = c;
                        ai$(b).parent().find(d.params.cssSelector.rateButton).show();
                        c = f.result;
                        if ("undefined" == typeof c) {
                            if ("function" == typeof d.params.onScoreError)
                                if (a = a[d.lastRecordId].errId,
                                "undefined" == typeof a)
                                    d.params.onScoreError("TIMEOUT", b);
                                else
                                    d.params.onScoreError(a, b)
                        } else if (null != c && "undefined" != typeof c.error && "undefined" != typeof c.error.errMsg && "undefined" != typeof c.errID)
                            "function" == typeof d.params.onScoreError && (chivox.AiStatusCode.trySet(c.errID, c.error.errMsg),
                            d.params.onScoreError(c.errID, b));
                        else if (m.replayOff(ai$(b).parent().find(d.params.cssSelector.replay)),
                        "function" == typeof d.params.onScore)
                            d.params.onScore(a[d.lastRecordId], b)
                    }
                }
            })
        } else if ("function" == typeof d.params.onScoreError)
            d.params.onScoreError("NO_DATA")
    }
    function e() {
        m.recordOff();
        ai$(g.record).unbind("click");
        ai$(g.record).click(function() {
            var b = this;
            if (!d.recorder.canRecord) {
                if (k.open(),
                m.recordOff(),
                m.replayDisabled(),
                "function" == typeof d.params.onError)
                    d.params.onError("RECORDER_NOT_READY")
            } else if (!ai$(this).hasClass("recordDisabled"))
                if (ai$(this).hasClass("recordOff")) {
                    d.lastRecordId = "";
                    ai$(b).attr("dataRecordId", "");
                    m.recordDisabled();
                    d.scoreData = {};
                    ai$(g.rateButton).hide();
                    d.resetStatus(null, b, null);
                    if ("function" == typeof d.params.onBeforeRecord)
                        d.params.onBeforeRecord(b);
                    var a = 2E3
                      , f = d.params.data.serverParams.coreType;
                    if (d.params.data.duration)
                        a = d.params.data.duration;
                    else if ("cn.word.score" == f || "cn.sent.score" == f)
                        a = 2E3 + 600 * ai$.trim(d.params.data.serverParams.refText).split("-").length;
                    else if ("en.word.score" == f || "en.sent.score" == f)
                        a = 2E3 + 600 * ai$.trim(d.params.data.serverParams.refText).split(" ").length;
                    d.recorder.record({
                        duration: a,
                        playNotifyAudio: d.params.data.playNotifyAudio,
                        originalResult: d.params.originalResult,
                        serverParams: d.params.data.serverParams,
                        onRecordIdGenerated: function(a, c) {
                            d.lastRecordId = c.recordId;
                            ai$(b).attr("dataRecordId", c.recordId);
                            if ("function" == typeof d.params.onRecordIdGenerated)
                                d.params.onRecordIdGenerated(a, c)
                        },
                        onStart: function(c, f) {
                            m.recordOn(b);
                            m.recordAbled();
                            n.start(a, b);
                            if ("function" == typeof d.params.onRecordStart)
                                d.params.onRecordStart(b)
                        },
                        onStop: function(a, f) {
                            m.recordOff();
                            n.stop();
                            c(b);
                            if ("function" == typeof d.params.onAfterRecord)
                                d.params.onAfterRecord()
                        },
                        onInternalScore: function(b, a) {
                            if ("function" == typeof d.params.onInternalScore)
                                d.params.onInternalScore(a)
                        }
                    })
                } else
                    n.stop(),
                    m.recordOff(),
                    d.recorder.stop({
                        onStop: function(a, f) {
                            if ("function" == typeof d.params.onAfterRecord)
                                d.params.onAfterRecord();
                            c(b)
                        }
                    })
        })
    }
    function f() {
        m.replayDisabled();
        ai$(g.replay).unbind("click").click(function() {
            var b = this;
            if (!d.recorder.canRecord) {
                if (m.recordOff(),
                m.replayDisabled(),
                k.open(),
                "function" == typeof d.params.onError)
                    d.params.onError("RECORDER_NOT_READY")
            } else if (!ai$(this).hasClass("replayDisabled")) {
                var a = ai$(this).parent().find(d.params.cssSelector.record).attr("dataRecordId");
                if ("" != a)
                    if (ai$(this).hasClass("replayOff")) {
                        if ("function" == typeof d.params.onBeforeReplay)
                            d.params.onBeforeReplay();
                        d.resetStatus(null, null, b);
                        m.replayOn(b);
                        a = {
                            recordId: a,
                            onStop: function() {
                                m.replayOff(b);
                                if ("function" == typeof d.params.onAfterReplay)
                                    d.params.onAfterReplay()
                            }
                        };
                        ai$("#replayStartPos")[0] && ai$("#replayStopPos")[0] && (ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStartPos", ai$("#replayStartPos").val()),
                        ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStopPos", ai$("#replayStopPos").val()));
                        ai$("#replayExpand")[0] && ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayExpand", ai$("#replayExpand").val());
                        var c = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStartPos")
                          , f = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStopPos")
                          , e = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayExpand");
                        c && f && (a.startPos = c,
                        a.stopPos = f);
                        e && (a.expand = e);
                        d.recorder.startReplay(a)
                    } else
                        m.replayOff(b),
                        d.recorder.stopReplay({
                            onStop: function() {
                                if ("function" == typeof d.params.onAfterReplay)
                                    d.params.onAfterReplay()
                            }
                        })
            }
        })
    }
    var d = this;
    d.lastRecordId = "";
    d.scoreData = {};
    this.recorder = this.player = null;
    this.params = {
        appKey: "",
        mode: chivox.MODE.FLASH,
        sigurl: "",
        server: "ws://cloud.chivox.com",
        back_server: null,
        autoDetectNetwork: !0,
        autoDetectMic: !1,
        playerId: "player",
        recorderId: "recorder",
        dialogSelector: "#aiMediaDialog",
        dialogOverlaySelector: "#aiMediaDialogOverlay",
        cssSelectorAncestor: "#aiPanel",
        debugInfo: !0,
        micWatch: !1,
        originalResult: !1,
        sigTimeOut: 2400,
        cssSelector: {
            play: ".play",
            record: ".record",
            replay: ".replay",
            rateButton: ".rateButton",
            recordProgressBar: ".recordProgressBar",
            dialogCloseButton: ".dialogCloseButton",
            dialogFlashError: ".dialogFlashError",
            dialogInfo: ".dialogInfo",
            dialogBody: ".dialogBody",
            okButton: ".okButton"
        },
        flashWmode: "transparent",
        language: "zh-CN",
        data: {
            audioUrl: "",
            playPosition: "",
            playDuration: "",
            duration: 0,
            playNotifyAudio: !0,
            serverParams: ""
        },
        onRateError: function() {
            alert("\u8bf7\u5148\u5f55\u97f3\u518d\u8bc4\u8bba")
        },
        onDialogOpened: function() {},
        onDialogClosed: function() {},
        onBeforePlay: function(b) {},
        onAfterPlay: function() {},
        onInitSuccess: function() {},
        onBeforeRecord: function() {},
        onRecordStart: function() {},
        onAfterRecord: function() {},
        onRecordIdGenerated: function() {},
        onBeforeScore: function() {},
        onScore: function(b) {},
        onInternalScore: function(b) {},
        onScoreError: function(b) {},
        onBeforeReplay: function() {},
        onAfterReplay: function() {},
        onReset: function() {},
        onError: function(b) {},
        onPlayerError: function(b, a) {},
        onRecorderError: function(b, a) {}
    };
    "undefined" != typeof a && ai$.extend(d.params, a);
    if (d.params.mode != chivox.MODE.FLASH && d.params.mode != chivox.MODE.HTML5) {
        if ("function" == typeof d.params.onError)
            d.params.onError("[ AiPanel ]: \u53ea\u652f\u6301\u6a21\u5f0f: chivox.MODE.FLASH\u6216chivox.MODE.HTML5\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570mode\u503c\u4e3a\uff1a" + d.params.mode);
        console.error("[ AiPanel ]: \u53ea\u652f\u6301\u6a21\u5f0f: chivox.MODE.FLASH\u6216chivox.MODE.HTML5\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570mode\u503c\u4e3a\uff1a" + d.params.mode)
    } else if ("string" != typeof d.params.server || "" === d.params.server) {
        if ("function" == typeof d.params.onError)
            d.params.onError("[ AiPanel ]: server\u53c2\u6570\u683c\u5f0f\u4e0d\u5bf9\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570server\u503c\u4e3a\uff1a" + d.params.server);
        console.error("[ AiPanel ]: server\u53c2\u6570\u683c\u5f0f\u4e0d\u5bf9\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570server\u503c\u4e3a\uff1a" + d.params.server)
    } else if ("string" == typeof d.params.back_server && "" == d.params.back_server) {
        if ("function" == typeof d.params.onError)
            d.params.onError("[ AiPanel ]: back_server\u53c2\u6570\u683c\u5f0f\u4e0d\u5bf9\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570back_server\u503c\u4e3a\uff1a" + d.params.back_server);
        console.error("[ AiPanel ]: back_server\u53c2\u6570\u683c\u5f0f\u4e0d\u5bf9\u3002\u5f53\u524d\u8f93\u5165\u7684\u53c2\u6570back_server\u503c\u4e3a\uff1a" + d.params.back_server)
    } else {
        var g = {
            panel: d.params.cssSelectorAncestor,
            play: d.params.cssSelectorAncestor + " " + d.params.cssSelector.play,
            record: d.params.cssSelectorAncestor + " " + d.params.cssSelector.record,
            replay: d.params.cssSelectorAncestor + " " + d.params.cssSelector.replay,
            recordProgressBar: d.params.cssSelector.recordProgressBar,
            rateButton: d.params.cssSelectorAncestor + " " + d.params.cssSelector.rateButton,
            dialogCloseButton: d.params.dialogSelector + " " + d.params.cssSelector.dialogCloseButton,
            dialogFlashError: d.params.dialogSelector + " " + d.params.cssSelector.dialogFlashError,
            dialogInfo: d.params.dialogSelector + " " + d.params.cssSelector.dialogInfo,
            dialogBody: d.params.dialogSelector + " " + d.params.cssSelector.dialogBody,
            okButton: d.params.dialogSelector + " " + d.params.cssSelector.okButton
        };
        this.selector = g;
        var h = {
            show: function(b) {
                var a = ["connectServerInit", "connectServerStart", "connectServerSuccess", "connectServerError"];
                if (-1 < ai$.inArray(b, a))
                    for (var c in a)
                        0 != a.hasOwnProperty(c) && a[c] != b && h.hide(a[c]);
                a = ["micStatusAllow", "micStatusDisallow", "micStatusError", "mmscfgError"];
                if (-1 < ai$.inArray(b, a))
                    for (c in a)
                        0 != a.hasOwnProperty(c) && a[c] != b && h.hide(a[c]);
                ai$(g.dialogInfo + " ." + b).show()
            },
            hide: function(b) {
                ai$(g.dialogInfo + " ." + b).hide()
            }
        };
        a = {
            open: function() {
                ai$(d.params.dialogOverlaySelector).show();
                0 == chivox.AiFlashDetect.hasFlash ? (ai$(g.dialogFlashError).find(".flashPlugin").show(),
                ai$(g.dialogFlashError).show(),
                ai$(g.dialogInfo).hide(),
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogSuccess").addClass("aiMediaDialogError")) : 10.2 > parseFloat(chivox.AiFlashDetect.version) ? (ai$(g.dialogFlashError).find(".flashVersion").show(),
                ai$(g.dialogFlashError).show(),
                ai$(g.dialogInfo).hide(),
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogSuccess").addClass("aiMediaDialogError")) : (ai$(g.dialogFlashError).hide(),
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogError").addClass("aiMediaDialogSuccess"),
                d.recorder.hideVolumeBar());
                ai$(d.params.dialogSelector).show();
                if ("function" == typeof d.params.onDialogOpened)
                    d.params.onDialogOpened()
            },
            close: function() {
                ai$(d.params.dialogOverlaySelector).hide();
                ai$(g.dialogFlashError).hide();
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogSuccess aiMediaDialogError").addClass("aiMediaDialogClosed");
                d.recorder.showVolumeBar();
                if ("function" == typeof d.params.onDialogClosed)
                    d.params.onDialogClosed()
            }
        };
        var l = {
            open: function() {
                var b = ai$("#" + d.params.recorderId);
                ai$(d.params.dialogOverlaySelector).show();
                ai$(d.params.dialogSelector).show();
                b.addClass("volumeBarInDialog");
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed").addClass("aiMediaDialogSuccess aiMediaDialogError");
                d.recorder.showVolumeBar();
                if ("function" == typeof d.params.onDialogOpened)
                    d.params.onDialogOpened()
            },
            close: function() {
                ai$("#" + d.params.recorderId).removeClass("volumeBarInDialog");
                ai$(d.params.dialogOverlaySelector).hide();
                ai$(g.dialogFlashError).hide();
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogSuccess aiMediaDialogError").addClass("aiMediaDialogClosed");
                d.recorder.showVolumeBar();
                if ("function" == typeof d.params.onDialogClosed)
                    d.params.onDialogClosed()
            }
        }
          , k = d.params.mode == chivox.MODE.FLASH ? a : l;
        this.Dialog = k;
        var q = this.Media = {
            createPlayer: function() {
                d.params.MODE == chivox.MODE.FLASH && h.show("loadFlashPlayer");
                d.player = new chivox.AiPlayer({
                    id: d.params.playerId,
                    mode: d.params.mode,
                    width: 1,
                    height: 1,
                    debugInfo: d.params.debugInfo,
                    onFlashLoad: function(b, a) {
                        d.params.MODE == chivox.MODE.FLASH && h.hide("loadFlashPlayer")
                    },
                    onError: function(b, a) {
                        if ("function" == typeof d.params.onPlayerError)
                            d.params.onPlayerError(b, a)
                    }
                })
            },
            createRecorder: function() {
                h.show("loadFlashRecorder at: " + d.params.recorderId);
                var b = {
                    id: d.params.recorderId,
                    appKey: d.params.appKey,
                    server: d.params.server,
                    back_server: d.params.back_server,
                    mode: d.params.mode,
                    sigurl: d.params.sigurl,
                    userId: d.params.data.serverParams.userId || "guest",
                    wmode: d.params.flashWmode,
                    debugInfo: d.params.debugInfo,
                    micWatch: d.params.micWatch,
                    coreTimeout: d.params.data.serverParams.coreTimeout || 6E4,
                    language: d.params.language,
                    jssdkVersion: chivox.jssdkVersion,
                    sigTimeOut: d.params.sigTimeOut,
                    onFlashLoad: function(b, a) {
                        h.hide("loadFlashRecorder")
                    },
                    onInitSuccess: function() {
                        if ("function" == typeof d.params.onInitSuccess)
                            d.params.onInitSuccess()
                    },
                    onMicStatusChange: function(b, a) {
                        "50001" == b ? h.show("micStatusAllow") : "50008" != b && ("50002" == b ? h.show("micStatusDisallow") : "50003" == b ? h.show("micStatusError") : "50007" == b && h.show("mmscfgError"),
                        d.params.autoDetectMic && k.open());
                        if ("function" == typeof d.params.onMicStatusChange)
                            d.params.onMicStatusChange(b, a)
                    },
                    onConnectorStatusChange: function(b, a) {
                        if ("50109" == b)
                            h.show("connectServerStart");
                        else if ("50100" == b)
                            h.show("connectServerSuccess");
                        else if ("50101" == b || "50103" == b || "50104" == b || "connection.disconnected" == b)
                            h.show("connectServerError"),
                            d.recorder.reset(),
                            n.hide(),
                            n.reset(),
                            m.recordOff(),
                            m.replayDisabled(),
                            "connection.disconnected" == b && h.show("connectServerInit"),
                            d.params.autoDetectNetwork && k.open();
                        if ("function" == typeof d.params.onConnectorStatusChange)
                            d.params.onConnectorStatusChange(b, a)
                    },
                    onError: function(b, a) {
                        if ("function" == typeof d.params.onRecorderError && "function" == typeof d.params.onError)
                            d.params.onError(b, a);
                        else
                            d.params.onRecorderError(b, a)
                    }
                };
                d.params.hasOwnProperty("signature") && (b.signature = d.params.signature);
                var a = ["connectLocalService", "localServiceUrl", "latencyCheckServiceApplication"], c;
                for (c in a) {
                    var f = a[c];
                    "undefined" != typeof d.params[f] && (b[f] = d.params[f])
                }
                d.recorder = new chivox.AiRecorder(b)
            }
        };
        (function() {
            q.createPlayer();
            q.createRecorder();
            ai$(g.rateButton).unbind("click").click(function() {
                var b = ai$(this).parent().find(d.params.cssSelector.record).attr("dataRecordId");
                if ("" == b) {
                    if ("function" == typeof d.params.onRateError)
                        d.params.onRateError()
                } else {
                    var a = "ratePanel" + (new Date).getTime();
                    var c = '<div id="' + a + '" class="ratePopup">  <p>\u6211\u89c9\u5f97\u8fd9\u6b21\u8bc4\u5206\u592a\u4e0d\u51c6\u54e6\uff01</p>  <div class="feedbackForm">';
                    c += '    <label>\u60a8\u7684\u90ae\u7bb1\uff1a<input class="email" type="text" name="email" value=""/></label><br/>';
                    c += '    <label>* \u5907\u3000\u6ce8\uff1a<textarea class="feedback"></textarea></label><br/>';
                    c += '    <div class="buttonTableDiv">';
                    c += '      <table class="buttonTable" border="0" cellpadding="0" cellspacing="0"><tr>';
                    c += '        <td align="center"><button class="submitButton">\u63d0\u4ea4</button></td>';
                    c += '        <td align="center"><button class="cancelButton">\u53d6\u6d88</button></td>';
                    c += "      </tr></table>";
                    c += "    </div>";
                    c += "  </div>";
                    c += "</div>";
                    ai$(g.panel).append(c);
                    ai$("#" + a).show();
                    ai$("#" + a).find(".submitButton").unbind("click").click(function() {
                        if ("" == ai$.trim(ai$("#" + a + " .feedback").val()))
                            return alert("\u8bf7\u5728\u5907\u6ce8\u4e2d\u63cf\u8ff0\u5177\u4f53\u7684\u4fe1\u606f"),
                            !1;
                        ai$("#" + a).hide();
                        ai$.ajax({
                            url: "http://api.chivox.com/sdk-monitor/monitor/recordFeedback",
                            type: "GET",
                            data: {
                                recordId: b,
                                email: ai$("#" + a + " .email").val(),
                                remarks: encodeURIComponent(ai$("#" + a + " .feedback").val())
                            },
                            dataType: "jsonp",
                            success: function() {
                                ai$("#" + a).remove()
                            }
                        })
                    });
                    ai$("#" + a).find(".cancelButton").unbind("click").click(function() {
                        ai$("#" + a).remove()
                    })
                }
            });
            ai$(g.okButton).unbind("click").click(function() {
                k.close()
            });
            ai$(g.dialogCloseButton).unbind("click").click(function() {
                k.close()
            });
            d.params.mode == chivox.MODE.HTML5 && k.open()
        }
        )();
        var n = {
            __el: null,
            __duration: 0,
            __intervalId: null,
            __startTime: 0,
            __clear: function() {
                this.__startTime = this.__duration = 0;
                null != this.__intervalId && (window.clearInterval(this.__intervalId),
                this.__intervalId = null)
            },
            start: function(b, a) {
                var c = this;
                c.__clear();
                c.__duration = b;
                c.__el = a;
                c.__startTime = +new Date;
                var f = ai$(a).parent().find(g.recordProgressBar).width()
                  , e = f / b;
                ai$(a).parent().find(g.recordProgressBar).show().find(".text").show();
                c.__intervalId = window.setInterval(function() {
                    var b = (+new Date - c.__startTime) * e;
                    b >= f ? ai$(a).parent().find(g.recordProgressBar).find(".value").width("100%") : ai$(a).parent().find(g.recordProgressBar).find(".value").width(b)
                }, 100)
            },
            stop: function() {
                this.__clear();
                ai$(this.__el).parent().find(g.recordProgressBar).find(".text").hide();
                ai$(this.__el).parent().find(g.recordProgressBar).hide();
                ai$(this.__el).parent().find(g.recordProgressBar).find(".value").width("0%")
            },
            reset: function() {
                this.__clear();
                ai$(g.recordProgressBar).find(".value").width("0%")
            },
            hide: function() {
                ai$(g.recordProgressBar).find(".text").hide();
                ai$(g.recordProgressBar).hide()
            }
        };
        this.ProgressBar = n;
        var m = {
            playOff: function() {
                ai$(g.play).removeClass("playOn").addClass("playOff")
            },
            playOn: function(b) {
                "undefined" != typeof b ? ai$(b).removeClass("playOff").addClass("playOn") : ai$(g.play).removeClass("playOff").addClass("playOn")
            },
            recordOff: function() {
                ai$(g.record).removeClass("recordOn").addClass("recordOff")
            },
            recordOn: function(b) {
                "undefined" != typeof b ? ai$(b).removeClass("recordOff").addClass("recordOn") : ai$(g.record).removeClass("recordOff").addClass("recordOn")
            },
            recordDisabled: function() {
                ai$(g.record).removeClass("recordDisabled").addClass("recordDisabled")
            },
            recordAbled: function() {
                ai$(g.record).removeClass("recordDisabled")
            },
            replayDisabled: function(b) {
                "undefined" != typeof b ? ai$(b).removeClass("replayOff replayOn").addClass("replayDisabled").parent().find(d.params.cssSelector.record).attr("dataRecordId", "") : ai$(g.replay).removeClass("replayOff replayOn").addClass("replayDisabled").parent().find(d.params.cssSelector.record).attr("dataRecordId", "")
            },
            replayOff: function(b) {
                "undefined" != typeof b ? ai$(b).removeClass("replayDisabled replayOn").addClass("replayOff") : ai$(g.replay).removeClass("replayDisabled replayOn").addClass("replayOff")
            },
            replayOn: function(b) {
                "undefined" != typeof b ? ai$(b).removeClass("replayDisabled replayOff").addClass("replayOn") : ai$(g.replay).removeClass("replayDisabled replayOff").addClass("replayOn")
            }
        };
        d.resetStatus = function(b, a, c) {
            d.player.reset();
            d.recorder.reset();
            n.hide();
            n.reset();
            m.playOff();
            m.recordOff();
            "undefined" == typeof b && "undefined" == typeof a && "undefined" == typeof c ? m.replayDisabled() : (ai$(g.replay).each(function() {
                ai$(this).hasClass("replayDisabled") || m.replayOff(this)
            }),
            "undefined" != typeof a && null != a && m.replayDisabled(ai$(a).parent().find(d.params.cssSelector.replay)[0]));
            if ("function" == typeof d.params.onReset)
                d.params.onReset()
        }
        ;
        b();
        e();
        f();
        this.rebind = function() {
            b();
            e();
            f()
        }
    }
}
;
chivox.AiPanel.prototype.setData = function(a) {
    this.scoreData = {};
    ai$(this.selector.rateButton).hide();
    this.resetStatus();
    "undefined" != typeof a && (this.params.data = a)
}
;
chivox.AiPanel.prototype.dispose = function(a) {
    var b = 0;
    this.player && this.player._audioContext && (this.player._audioContext.close().then(function() {
        b++;
        3 == b && "function" == typeof a && a()
    }),
    this.player._audioContext = null,
    this.player._audio_src = null,
    this.player._audio_gain = null);
    this.recorder && this.recorder.engine && this.recorder.engine.audioContext && (this.recorder.engine.audioContext.close().then(function() {
        b++;
        3 == b && "function" == typeof a && a()
    }),
    this.recorder.engine.audioContext = null,
    this.recorder.engine.audioInput = null,
    this.recorder.engine.realAudioInput = null,
    this.recorder.engine.inputPoint = null,
    this.recorder.engine.analyserNode = null);
    this.recorder && this.recorder.vAudioCtx && (this.recorder.vAudioCtx.close().then(function() {
        b++;
        3 == b && "function" == typeof a && a()
    }),
    this.recorder.vAudioCtx = null)
}
;
chivox.AiPanelParagraph = function(a) {
    this.aiPanel = a.aiPanel;
    this.replayPartIndex = this.recordPartIndex = this.playPartIndex = 0;
    this.onReset = a.onReset;
    this.selector = {
        play: "#playParagraph",
        record: "#recordParagraph",
        replay: "#replayParagraph",
        data: "#paragraphData"
    };
    this.lastRecordId = "";
    this.replayArr = {};
    this.playParams = {};
    this.recordParams = {};
    this.replayParams = {};
    this.replayTimeoutId = null
}
;
chivox.AiPanelParagraph.prototype.resetAllStatus = function(a) {
    var b = this;
    b.aiPanel.player.reset();
    "undefined" == typeof a || 0 == a ? b.aiPanel.recorder.reset() : (b.aiPanel.recorder.stop(),
    b.aiPanel.recorder.stopReplay(),
    "" != b.lastRecordId && function(a, e) {
        b.aiPanel.recorder.getScores({
            recordId: e,
            success: function(c) {
                b.replayArr[a] = e;
                if ("function" == typeof b.recordParams.onScore)
                    b.recordParams.onScore(c, e, a);
                if (b.recordPartIndex < b.recordParams.serverParams.length - 1)
                    b.recordPartIndex++,
                    b.__startRecord();
                else {
                    b.recordPartIndex = 0;
                    ai$(b.selector.record).removeClass("recordParagraphActive");
                    if ("function" == typeof b.recordParams.onReset)
                        b.recordParams.onReset();
                    if ("function" == typeof b.recordParams.onStop)
                        b.recordParams.onStop()
                }
            }
        })
    }(b.recordPartIndex, b.lastRecordId));
    b.playPartIndex = 0;
    b.recordPartIndex = 0;
    b.replayPartIndex = 0;
    null != b.replayTimeoutId && (window.clearTimeout(b.replayTimeoutId),
    b.replayTimeoutId = null);
    b.aiPanel.ProgressBar.hide();
    b.aiPanel.ProgressBar.reset();
    ai$(b.aiPanel.params.cssSelectorAncestor + " " + b.aiPanel.params.cssSelector.play).removeClass("playOn").addClass("playOff");
    ai$(b.selector.play).removeClass("playParagraphActive");
    ai$(b.selector.record).removeClass("recordParagraphActive");
    ai$(b.selector.replay).removeClass("replayParagraphActive");
    if ("fucntion" == typeof b.onReset)
        b.onReset(a)
}
;
chivox.AiPanelParagraph.prototype.bindPlayEvent = function(a) {
    var b = this;
    b.playParams = a;
    ai$(b.selector.play).unbind("click").click(function() {
        var a = b.playParams.audioUrl;
        if ("function" == typeof b.playParams.onReset)
            b.playParams.onReset();
        if (b.aiPanel.player.canPlay)
            if (ai$(this).hasClass("playParagraphActive")) {
                if (b.playPartIndex = 0,
                ai$(this).removeClass("playParagraphActive"),
                "function" == typeof b.playParams.onStop)
                    b.playParams.onStop()
            } else {
                b.resetAllStatus();
                ai$(this).addClass("playParagraphActive");
                if ("function" == typeof b.playParams.onStart)
                    b.playParams.onStart();
                b.aiPanel.params.onBeforePlay = function() {
                    b.aiPanel.params.data = {
                        audioUrl: a[b.playPartIndex]
                    };
                    if ("function" == typeof b.playParams.onBeforeStart)
                        b.playParams.onBeforeStart(b.playPartIndex)
                }
                ;
                b.aiPanel.params.onAfterPlay = function(c) {
                    if ("function" == typeof b.playParams.onReset)
                        b.playParams.onReset();
                    if (b.playPartIndex < a.length - 1)
                        b.playPartIndex++,
                        ai$(b.aiPanel.selector.play).click();
                    else if (b.playPartIndex = 0,
                    ai$(b.selector.play).removeClass("playParagraphActive"),
                    "function" == typeof b.playParams.onStop)
                        b.playParams.onStop()
                }
            }
        ai$(b.aiPanel.selector.play).click()
    })
}
;
chivox.AiPanelParagraph.prototype.__startRecord = function() {
    var a = this;
    a.lastRecordId = "";
    if ("function" == typeof a.recordParams.onReset)
        a.recordParams.onReset();
    var b = a.recordParams.serverParams[a.recordPartIndex]
      , c = 2E3 + 600 * ai$.trim(b.refText).split(" ").length;
    "undefined" != typeof a.recordParams.recordDuration && a.recordParams.recordDuration[a.recordPartIndex] && (c = a.recordParams.recordDuration[a.recordPartIndex]);
    a.aiPanel.recorder.record({
        duration: c,
        playNotifyAudio: a.recordParams.playNotifyAudio,
        serverParams: b,
        onRecordIdGenerated: function(b, c) {
            a.lastRecordId = c.recordId
        },
        onStart: function(b, f) {
            a.aiPanel.ProgressBar.start(c, ai$(a.selector.record)[0]);
            if ("function" == typeof a.recordParams.onBeforeStart)
                a.recordParams.onBeforeStart(a.recordPartIndex)
        },
        onStop: function(b, c) {
            a.stopRecord(!1)
        }
    })
}
;
chivox.AiPanelParagraph.prototype.bindRecordEvent = function(a) {
    var b = this;
    b.recordParams = a;
    ai$(b.selector.record).unbind("click").click(function() {
        if (b.aiPanel.recorder.canRecord)
            if (ai$(this).hasClass("recordParagraphActive")) {
                b.aiPanel.recorder.stop();
                b.aiPanel.ProgressBar.stop();
                "" != b.lastRecordId && function(a, e) {
                    b.aiPanel.recorder.getScores({
                        recordId: e,
                        success: function(c) {
                            b.replayArr[a] = e;
                            if ("function" == typeof b.recordParams.onScore)
                                b.recordParams.onScore(c, e, a);
                            if (b.recordPartIndex < b.recordParams.serverParams.length - 1)
                                b.recordPartIndex++,
                                b.__startRecord();
                            else {
                                b.recordPartIndex = 0;
                                ai$(b.selector.record).removeClass("recordParagraphActive");
                                if ("function" == typeof b.recordParams.onReset)
                                    b.recordParams.onReset();
                                if ("function" == typeof b.recordParams.onStop)
                                    b.recordParams.onStop()
                            }
                        }
                    })
                }(b.recordPartIndex, b.lastRecordId);
                b.recordPartIndex = 0;
                ai$(this).removeClass("recordParagraphActive");
                if ("function" == typeof b.recordParams.onReset)
                    b.recordParams.onReset();
                if ("function" == typeof b.recordParams.onStop)
                    b.recordParams.onStop()
            } else {
                b.resetAllStatus();
                b.replayArr = {};
                ai$(this).addClass("recordParagraphActive");
                if ("function" == typeof b.recordParams.onStart)
                    b.recordParams.onStart();
                b.__startRecord()
            }
        else
            ai$(b.aiPanel.selector.record).click()
    })
}
;
chivox.AiPanelParagraph.prototype.__startReplay = function() {
    var a = this, b = 0, c = 0, e;
    for (e in a.replayArr)
        if (0 != a.replayArr.hasOwnProperty(e)) {
            if (c == a.replayPartIndex) {
                b = e;
                break
            }
            c++
        }
    if ("function" == typeof a.replayParams.onReset)
        a.replayParams.onReset();
    a.aiPanel.recorder.startReplay({
        recordId: a.replayArr[b],
        onStart: function() {
            if ("function" == typeof a.replayParams.onBeforeStart)
                a.replayParams.onBeforeStart(b)
        },
        onStop: function() {
            var b = 0, c;
            for (c in a.replayArr)
                0 != a.replayArr.hasOwnProperty(c) && b++;
            if (a.replayPartIndex < b - 1)
                null != a.replayTimeoutId && (window.clearTimeout(a.replayTimeoutId),
                a.replayTimeoutId = null),
                a.replayPartIndex++,
                a.replayTimeoutId = setTimeout(function() {
                    a.__startReplay()
                }, 100);
            else {
                a.replayPartIndex = 0;
                ai$(a.selector.replay).removeClass("replayParagraphActive");
                if ("function" == typeof a.replayParams.onReset)
                    a.replayParams.onReset();
                if ("function" == typeof a.replayParams.onStop)
                    a.replayParams.onStop()
            }
        }
    })
}
;
chivox.AiPanelParagraph.prototype.bindReplayEvent = function(a) {
    var b = this;
    b.replayParams = a;
    ai$(b.selector.replay).unbind("click").click(function() {
        if (b.aiPanel.recorder.canRecord) {
            var a = 0, e;
            for (e in b.replayArr)
                0 != b.replayArr.hasOwnProperty(e) && a++;
            if (0 < a)
                if (ai$(this).hasClass("replayParagraphActive")) {
                    b.aiPanel.recorder.stopReplay();
                    b.replayPartIndex = 0;
                    ai$(this).removeClass("replayParagraphActive");
                    if ("function" == typeof b.replayParams.onReset)
                        b.replayParams.onReset();
                    if ("function" == typeof b.replayParams.onStop)
                        b.replayParams.onStop()
                } else {
                    b.resetAllStatus();
                    ai$(this).addClass("replayParagraphActive");
                    if ("function" == typeof b.replayParams.onStart)
                        b.replayParams.onStart();
                    b.__startReplay()
                }
        } else
            ai$(b.aiPanel.selector.record).click()
    })
}
;
chivox.AiPanelParagraph.prototype.stopRecord = function(a) {
    var b = this;
    b.aiPanel.recorder.stop();
    b.aiPanel.ProgressBar.stop();
    "" != b.lastRecordId && function(a, e) {
        b.aiPanel.recorder.getScores({
            recordId: e,
            success: function(c) {
                b.replayArr[a] = e;
                if ("function" == typeof b.recordParams.onScore)
                    b.recordParams.onScore(c, e, a);
                if (b.recordPartIndex < b.recordParams.serverParams.length - 1)
                    b.recordPartIndex++,
                    b.__startRecord();
                else {
                    b.recordPartIndex = 0;
                    ai$(b.selector.record).removeClass("recordParagraphActive");
                    if ("function" == typeof b.recordParams.onReset)
                        b.recordParams.onReset();
                    if ("function" == typeof b.recordParams.onStop)
                        b.recordParams.onStop()
                }
            }
        })
    }(b.recordPartIndex, b.lastRecordId);
    if ("undefined" != typeof a && 0 != a) {
        b.recordPartIndex = 0;
        ai$(b.selector.record).removeClass("recordParagraphActive");
        if ("function" == typeof b.recordParams.onReset)
            b.recordParams.onReset();
        if ("function" == typeof b.recordParams.onStop)
            b.recordParams.onStop()
    }
}
;
chivox.AiPlayerAS = function(a) {
    this.loaded = this.canPlay = !1;
    this.params = {
        id: "aiPlayer",
        flashPlayerUrl: chivox.host + "/Resources/swf/AudioPlayer4JS_v3.3.2.swf",
        expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
        isCache: !0,
        width: 1,
        height: 1,
        wmode: "Opaque",
        appKey: "",
        debugInfo: !0,
        secretKey: "",
        onFlashLoad: "",
        onError: ""
    };
    this.__extend(this.params, a);
    "undefined" == typeof jsReady && (window.jsReady = !1,
    window.jsIsReady = function() {
        return !0
    }
    );
    this.aiDebug = new chivox.AiDebug;
    this.volume = 1;
    this.__synthStarted = !1;
    chivox.AiPlayerAS.cache = chivox.AiPlayerAS.cache || {};
    chivox.AiPlayerAS.isConnectRtmpOK = chivox.AiPlayerAS.isConnectRtmpOK || !1;
    var b = this;
    b.__playOrderState = "PLAY_INIT";
    chivox.AiPlayerAS.cache[b.params.id + "OnFlashLoad"] = function(a, c) {
        b.loaded = !0;
        ai$("#" + b.params.id).removeClass("loading");
        "50000" === a && (b.canPlay = !0);
        "function" == typeof b.params.onFlashLoad && (1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("flashLoadEventHandler", a, c),
        chivox.updateMonitorLog({
            applicationId: b.params.appKey,
            logType: "INSTANCELOG",
            logEvent: "AUDIOPLAYER4JSREADY",
            audioPlayer4JSReady: !0,
            source: "SDK_JS"
        }),
        window.setTimeout(function() {
            b.params.onFlashLoad(a, c)
        }, 200))
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "OnLog"] = function(a) {
        1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && console.debug(a)
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "OnPlayerStateChange"] = function(a, c) {
        if ("50414" === a) {
            if (1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("playerEventHandler", a, c),
            "function" == typeof chivox.AiPlayerAS.cache[b.params.id + "LoadStartCallback"])
                chivox.AiPlayerAS.cache[b.params.id + "LoadStartCallback"](a, c)
        } else if ("50400" === a) {
            if (1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("playerEventHandler", a, c),
            "function" == typeof chivox.AiPlayerAS.cache[b.params.id + "LoadSuccessCallback"])
                chivox.AiPlayerAS.cache[b.params.id + "LoadSuccessCallback"](a, c)
        } else if ("50401" === a) {
            if ("PLAY_CMD_START" == b.__playOrderState && (b.__playOrderState = "PLAY_ACT_START",
            1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("playerEventHandler", a, c),
            "function" == typeof chivox.AiPlayerAS.cache[b.params.id + "PlayOnStartCallback"]))
                chivox.AiPlayerAS.cache[b.params.id + "PlayOnStartCallback"](a, c)
        } else if ("50402" === a)
            if (b.__playOrderState = "PLAY_ACT_STOP",
            1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("playerEventHandler", a, c),
            "0" == c.stopType) {
                if ("function" == typeof chivox.AiPlayerAS.cache[b.params.id + "PlayOnStopCallback"])
                    chivox.AiPlayerAS.cache[b.params.id + "PlayOnStopCallback"](a, c)
            } else {
                if ("1" == c.stopType && "function" == typeof chivox.AiPlayerAS.cache[b.params.id + "ForcePlayOnStopCallback"])
                    chivox.AiPlayerAS.cache[b.params.id + "ForcePlayOnStopCallback"](a, c)
            }
        else
            1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("UNREGISTERED playerEventHandler", a, c)
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "OnError"] = function(a, c) {
        1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("errorEventHandler", a, c);
        if ("50409" === a || "50410" === a)
            chivox.AiPlayerAS.cache[b.params.id + "LoadErrorCallback"](a, c);
        if ("function" == typeof b.params.onError)
            b.params.onError(a, c)
    }
    ;
    a = {
        flashLoadEventHandler: "chivox.AiPlayerAS.cache." + b.params.id + "OnFlashLoad",
        onPlayerEventHandler: "chivox.AiPlayerAS.cache." + b.params.id + "OnPlayerStateChange",
        errorEventHandler: "chivox.AiPlayerAS.cache." + b.params.id + "OnError",
        jsLogCallback: "chivox.AiPlayerAS.cache." + b.params.id + "OnLog"
    };
    var c = {
        param: function(a) {
            var b = [], c;
            for (c in a)
                0 != a.hasOwnProperty(c) && b.push(c + "=" + a[c]);
            return b.join("&").replace(/%20/g, "+")
        }
    }
      , e = b.params.flashPlayerUrl;
    0 == b.params.isCache && (e = e + "?guid=" + 99999999 * Math.random());
    "inux" == navigator.platform.match(/inux/g) ? (a = {
        movie: e,
        width: b.params.width,
        height: b.params.height,
        majorversion: "10",
        build: "0",
        id: b.params.id + "UFO",
        name: b.params.id + "UFO",
        wmode: b.params.wmode,
        allowscriptaccess: "always",
        flashvars: c.param(a)
    },
    UFO.create(a, b.params.id)) : (swfobject.embedSWF(e, b.params.id, b.params.width, b.params.height, "10.0.0", b.params.expressInstallUrl, a, {
        allowScriptAccess: "always",
        wmode: b.params.wmode
    }, {
        id: b.params.id,
        name: b.params.id,
        wmode: b.params.wmode
    }),
    ai$("#" + b.params.id).addClass("loading"))
}
;
chivox.AiPlayerAS.prototype.__extend = function(a, b) {
    if ("[object Object]" === Object.prototype.toString.call(a) && "[object Object]" === Object.prototype.toString.call(b))
        for (var c in b)
            0 != b.hasOwnProperty(c) && (a[c] = b[c])
}
;
chivox.AiPlayerAS.prototype.getAudioPlayer = function() {
    var a = null;
    try {
        a = "inux" == navigator.platform.match(/inux/g) ? document.getElementById(this.params.id + "UFO") : document.getElementById(this.params.id)
    } catch (b) {}
    return a
}
;
chivox.AiPlayerAS.prototype.reset = function() {
    "undefined" != typeof this.synthAjaxId && this.synthAjaxId.abort();
    this.__synthStarted && (__synthStarted = !1);
    var a = this.getPlayerStatus();
    "player.playing" != a && "player.bufferring" != a || this.stop();
    this.__playOrderState = "PLAY_INIT"
}
;
chivox.AiPlayerAS.prototype.load = function(a) {
    var b = this
      , c = {
        url: "",
        appKey: "",
        secretKey: "",
        start: "",
        success: "",
        error: ""
    };
    b.__extend(c, a);
    c.appKey = c.appKey || b.params.appKey;
    c.secretKey = c.secretKey || b.params.secretKey;
    chivox.AiPlayerAS.cache[b.params.id + "LoadStartCallback"] = function(a, f) {
        "function" == typeof c.start && c.start(a, f);
        delete this[b.params.id + "LoadStartCallback"]
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "LoadSuccessCallback"] = function(a, f) {
        "function" == typeof c.success && c.success(a, f);
        delete this[b.params.id + "LoadSuccessCallback"]
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "LoadErrorCallback"] = function(a, f) {
        "function" == typeof c.error && c.error(a, f);
        delete this[b.params.id + "LoadErrorCallback"]
    }
    ;
    a = b.getAudioPlayer();
    var e = {};
    e.appKey = c.appKey;
    e.secretKey = c.secretKey;
    var f = {};
    try {
        f = a.loadAudioFromURL(c.url, e)
    } catch (d) {}
    1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("load", c, f);
    return f
}
;
chivox.AiPlayerAS.prototype.play = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_START";
    var c = {
        position: "",
        duration: "",
        onStart: "",
        onStop: ""
    };
    b.__extend(c, a);
    isNaN(c.position) && (c.position = "");
    isNaN(c.duration) && (c.duration = "");
    chivox.AiPlayerAS.cache[b.params.id + "PlayOnStartCallback"] = function(a, e) {
        if ("function" == typeof c.onStart)
            c.onStart(a, e);
        delete this[b.params.id + "PlayOnStartCallback"]
    }
    ;
    chivox.AiPlayerAS.cache[b.params.id + "PlayOnStopCallback"] = function(a, b) {
        if ("function" == typeof c.onStop)
            c.onStop(a, b)
    }
    ;
    a = {};
    if (0 === c.duration)
        return chivox.AiPlayerAS.cache[b.params.id + "PlayOnStartCallback"](),
        chivox.AiPlayerAS.cache[b.params.id + "PlayOnStopCallback"](),
        a;
    var e = b.getAudioPlayer();
    try {
        a = e.startAudioPlay(c.position, c.duration, 100 * b.volume)
    } catch (f) {}
    1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("play", c, a);
    return a
}
;
chivox.AiPlayerAS.prototype.stop = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AiPlayerAS.cache[b.params.id + "ForcePlayOnStopCallback"] = function(a, e) {
        if ("function" == typeof c.onStop)
            c.onStop(a, e);
        delete this[b.params.id + "ForcePlayOnStopCallback"]
    }
    ;
    a = {};
    var e = b.getAudioPlayer();
    try {
        a = e.stopAudioPlay()
    } catch (f) {}
    1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("stop", c, a);
    return a
}
;
chivox.AiPlayerAS.prototype.setVolume = function(a) {
    if ("number" == typeof a && !1 === isNaN(a)) {
        0 > a ? a = 0 : 1 < a && (a = 1);
        this.volume = a;
        var b = this.getAudioPlayer();
        try {
            b.adjustVolume(100 * a)
        } catch (c) {}
    }
    1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("setVolume", this.volume);
    return this.volume
}
;
chivox.AiPlayerAS.prototype.getVolume = function() {
    var a = this.volume;
    1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getVolume", a);
    return a
}
;
chivox.AiPlayerAS.prototype.getPosition = function() {
    var a = {}
      , b = this.getAudioPlayer();
    try {
        a = b.getAudioCurrentTime()
    } catch (c) {}
    1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getPosition", a);
    return a
}
;
chivox.AiPlayerAS.prototype.getDuration = function() {
    var a = {}
      , b = this.getAudioPlayer();
    try {
        a = b.getAudioTotalTime()
    } catch (c) {}
    1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getDuration", a);
    return a
}
;
chivox.AiPlayerAS.prototype.getPlayerStatus = function() {
    var a = "player.unready"
      , b = this.getAudioPlayer();
    try {
        a = b.getPlayerStatus()
    } catch (c) {}
    1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getPlayerStatus", a);
    return a
}
;
chivox.AiPlayerAS.prototype.tts = function(a) {
    if (this.__synthStarted || "undefined" == typeof a || "undefined" == typeof a.uid || "undefined" == typeof a.appkey || "undefined" == typeof a.timestamp || "undefined" == typeof a.sig || "undefined" == typeof a.text || "undefined" == typeof a.coreType || "undefined" == typeof a.resource)
        return 1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("tts failed, check param options plz", a, this.__synthStarted),
        !1;
    var b = chivox.ttsUrl + "/" + a.coreType + "/" + a.resource;
    a.ip = "1.1.1.1";
    a.audio_type = "mp3";
    a.channel = 1;
    a.sample_rate = 16E3;
    a.sample_bytes = 2;
    a.request = '{"refText": "' + a.text + '"}';
    delete a.coreType;
    delete a.resource;
    delete a.text;
    this.__synthStarted = !0;
    var c = $("#frmTTS");
    c && c.remove();
    c = $("<form id='frmTTS'></form>");
    c.css("display", "none");
    c.attr("action", b);
    c.attr("enctype", "multipart/form-data");
    c.attr("method", "POST");
    c.attr("target", "_SELF");
    for (var e in a)
        b = $("<input></input>"),
        b.attr("name", e),
        b.attr("value", a[e]),
        c.append(b);
    $("body").append(c);
    c.submit();
    return this.__synthStarted = !1
}
;
chivox.AiPlayerAS.prototype.synth = function(a) {
    if ("undefined" != typeof a && "undefined" != typeof a.ttsUrl) {
        var b = this
          , c = {
            isRefresh: !1,
            synthHost: "http.api.chivox.com"
        };
        ai$.extend(c, a);
        c.isRefresh && delete b.synthData;
        b.__synthStarted = !0;
        if ("undefined" != typeof b.synthData) {
            if ("function" == typeof a.onGetSessionSuccess)
                a.onGetSessionSuccess(b.synthData);
            b.__synthStartLoadAudio(c)
        } else
            b.synthAjaxId = ai$.ajax({
                cache: !1,
                url: a.ttsUrl,
                dataType: "json",
                success: function(e) {
                    if (e && "undefined" == typeof e.error) {
                        b.synthData = e;
                        if ("function" == typeof a.onGetSessionSuccess)
                            a.onGetSessionSuccess(e);
                        b.__synthStartLoadAudio(c)
                    } else if ("function" == typeof a.onGetSessionError)
                        a.onGetSessionError(e)
                },
                error: function() {
                    if ("function" == typeof a.onGetSessionError)
                        a.onGetSessionError()
                }
            })
    }
}
;
chivox.AiPlayerAS.prototype.__synthStartLoadAudio = function(a) {
    var b = this, c = {
        applicationId: a.applicationId,
        session: b.synthData.session,
        lang: a.lang,
        text: encodeURIComponent(a.text),
        coreType: a.coreType,
        resource: a.resource
    }, e = "", f = 0, d;
    for (d in c)
        0 != c.hasOwnProperty(d) && (0 != f && (e += "&"),
        e += d + "=" + c[d],
        f++);
    b.load({
        url: "http://" + a.synthHost + "/api/v2.0/syn?" + e,
        success: function(c, f) {
            if (b.__synthStarted) {
                if ("function" == typeof a.onLoadSuccess)
                    a.onLoadSuccess(c, f);
                b.play({
                    position: "",
                    duration: "",
                    onStart: function(b, c) {
                        if ("function" == typeof a.onPlayStart)
                            a.onPlayStart(b, c)
                    },
                    onStop: function(c, f) {
                        b.__synthStarted = !1;
                        if ("function" == typeof a.onPlayStop)
                            a.onPlayStop(c, f)
                    }
                })
            }
        },
        error: function(b, c) {
            if ("function" == typeof a.onLoadError)
                a.onLoadError(b, c)
        }
    })
}
;
chivox.AiPlayerAS.prototype.stopSynth = function() {
    "undefined" != typeof this.synthAjaxId && this.synthAjaxId.abort();
    this.__synthStarted && (this.__synthStarted = !1);
    var a = this.getPlayerStatus();
    "player.playing" != a && "player.bufferring" != a || this.stop()
}
;
chivox.AiPlayer = function() {
    var a = function(a) {
        var b = this;
        this.loaded = this.canPlay = !1;
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        this._audioContext = new AudioContext;
        this._audio_src = this._audioContext.createBufferSource();
        this._audio_gain = this._audioContext.createGain();
        this._audio_gain.connect(this._audioContext.destination);
        this.params = {
            id: "aiPlayer",
            width: 1,
            height: 1,
            appKey: "",
            debugInfo: !0,
            onFlashLoad: function(b, a) {
                console.info("onFlashLoad", b, a)
            },
            onError: function(b) {
                console.error(b)
            }
        };
        this.__extend = function(b, a) {
            if ("[object Object]" === Object.prototype.toString.call(b) && "[object Object]" === Object.prototype.toString.call(a))
                for (var c in a)
                    0 != a.hasOwnProperty(c) && (b[c] = a[c])
        }
        ;
        this.__extend(this.params, a);
        this.__synthStarted = !1;
        this.reset = function() {
            this.stop(!0)
        }
        ;
        this.load = function(a) {
            if (a.hasOwnProperty("url") && "" !== a.url) {
                var c = new XMLHttpRequest;
                c.open("GET", a.url, !0);
                c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                c.responseType = "arraybuffer";
                c.onload = function() {
                    200 !== c.status ? a.hasOwnProperty("error") && a.error("url:" + a.url + "\u4e0d\u5b58\u5728\uff0c\u83b7\u53d6\u5931\u8d25\u3002 status: " + c.status) : b._audioContext.decodeAudioData(c.response, function(c) {
                        b._audio_buff = c;
                        a.hasOwnProperty("success") && a.success()
                    }, function(b) {
                        a.hasOwnProperty("error") && a.error(b)
                    })
                }
                ;
                c.send()
            } else
                b.params.onError("\u8bf7\u4f20\u5165url\u53c2\u6570")
        }
        ;
        this.play = function(a) {
            if (b._audio_buff && b._audioContext) {
                if (b._audio_src || (b._audio_src = b._audioContext.createBufferSource()),
                b._audio_src.connect(b._audio_gain),
                b._audio_src.buffer = b._audio_buff,
                "number" == typeof a.position && "number" == typeof a.duration ? b._audio_src.start(0, a.position / 1E3, a.duration / 1E3) : "number" == typeof a.position && "number" != typeof a.duration ? b._audio_src.start(0, a.position / 1E3) : "number" != typeof a.position && "number" == typeof a.duration ? b._audio_src.start(0, 0, a.duration / 1E3) : b._audio_src.start(0),
                b._audio_src.onended = function() {
                    b._audio_src = null;
                    if (a.hasOwnProperty("onStop"))
                        a.onStop()
                }
                ,
                a.hasOwnProperty("onStart"))
                    a.onStart()
            } else
                b.params.onError("buff or context is null")
        }
        ;
        this.stop = function(c) {
            b._audio_src && null != b._audio_src.onended && (b._audio_src.stop(),
            b._audio_src = null);
            if (!c && (1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && console.debug("[ AiPlayerH5.stop ]..."),
            a.hasOwnProperty("onStop")))
                a.onStop()
        }
        ;
        this.setVolume = function(a) {
            if (b._audio_gain)
                b._audio_gain.connect(this._audioContext.destination),
                b._audio_gain.gain.value = a;
            else
                b.params.onError("context or gain is null")
        }
        ;
        this.getVolume = function() {
            if (b._audio_gain)
                return b._audio_gain.connect(this._audioContext.destination),
                b._audio_gain.gain.value;
            b.params.onError("context or gain is null");
            return 0
        }
        ;
        this.getDuration = function() {}
        ;
        this.getPosition = function() {}
        ;
        this.tts = chivox.AiPlayerAS.prototype.tts;
        this.params.onFlashLoad(0, 0)
    };
    return function(b) {
        switch (b.mode) {
        case chivox.MODE.HTML5:
            navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (navigator.getMedia || navigator.mediaDevices.getUserMedia)
                var c = new a(b);
            else {
                if ("undefined" !== typeof b.onError)
                    b.onError("[ initPlayer ]\u6d4f\u89c8\u5668\u4e0d\u652f\u6301HTML5\u6a21\u5f0f!");
                console.error("[ initPlayer ]\u6d4f\u89c8\u5668\u4e0d\u652f\u6301HTML5\u6a21\u5f0f!");
                return null
            }
            break;
        case chivox.MODE.FLASH_FIRST:
            if ("undefined" === typeof b.initFlashTimeout) {
                if ("undefined" !== typeof b.onError)
                    b.onError("FLASH_FIRST\u6a21\u5f0f\u5fc5\u987b\u8981\u914d\u7f6einitFlashTimeout\u51fd\u6570");
                else
                    console.error("FLASH_FIRST\u6a21\u5f0f\u5fc5\u987b\u8981\u914d\u7f6einitFlashTimeout\u51fd\u6570");
                return null
            }
            var e = b.initFlashTimeout
              , f = e.timeout;
            c = new chivox.AiPlayerAS(b);
            setTimeout(function() {
                c.loaded || (ai$("#" + b.id).remove(),
                c = new a(b),
                c.mode = chivox.MODE.HTML5,
                e.h5PlayerInitialized(c))
            }, f);
            break;
        default:
            c = new chivox.AiPlayerAS(b)
        }
        c.mode = b.mode;
        return c
    }
}();
chivox.AudioPlayer = function(a) {
    function b(a) {
        "string" == typeof a && (a = a.replace(/%22/g, '"').replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%"));
        return a
    }
    this.canPlay = !1;
    this.params = {
        id: "audioPlayer",
        flashPlayerUrl: chivox.host + "/Resources/swf/AudioPlayer4JS_v3.2.12.swf",
        expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
        isCache: !0,
        width: 1,
        height: 1,
        wmode: "Opaque",
        appKey: "",
        secretKey: "",
        playerType: "MP3Player",
        onFlashLoad: "",
        onError: ""
    };
    this.__extend(this.params, a);
    "undefined" == typeof jsReady && (window.jsReady = !0,
    window.jsIsReady = function() {
        return !0
    }
    );
    this.aiDebug = new chivox.AiDebug;
    this.volume = 1;
    chivox.AudioPlayer.cache = chivox.AudioPlayer.cache || {};
    chivox.AudioPlayer.isConnectRtmpOK = chivox.AudioPlayer.isConnectRtmpOK || !1;
    var c = this;
    c.__playOrderState = "PLAY_INIT";
    chivox.AudioPlayer.cache[c.params.id + "OnFlashLoad"] = function(a, f) {
        f = b(f);
        "50000" === a && (c.canPlay = !0);
        "function" == typeof c.params.onFlashLoad && (c.aiDebug.debug("flashLoadEventHandler", a, f),
        chivox.updateMonitorLog({
            applicationId: c.params.appKey,
            logType: "INSTANCELOG",
            logEvent: "AUDIOPLAYER4JSREADY",
            audioPlayer4JSReady: !0,
            source: "SDK_JS"
        }),
        window.setTimeout(function() {
            c.params.onFlashLoad(a, f)
        }, 200))
    }
    ;
    chivox.AudioPlayer.cache[c.params.id + "OnPlayerStateChange"] = function(a, f) {
        f = b(f);
        var e = "string" == typeof f ? JSON.parse(f) : f;
        if ("50414" === a) {
            if (c.aiDebug.debug("playerEventHandler", a, f),
            "function" == typeof chivox.AudioPlayer.cache[c.params.id + "LoadStartCallback"])
                chivox.AudioPlayer.cache[c.params.id + "LoadStartCallback"](a, e)
        } else if ("50400" === a) {
            if (c.aiDebug.debug("playerEventHandler", a, f),
            "function" == typeof chivox.AudioPlayer.cache[c.params.id + "LoadSuccessCallback"])
                chivox.AudioPlayer.cache[c.params.id + "LoadSuccessCallback"](a, e)
        } else if ("50401" === a) {
            if ("PLAY_CMD_START" == c.__playOrderState && (c.__playOrderState = "PLAY_ACT_START",
            c.aiDebug.debug("playerEventHandler", a, f),
            "function" == typeof chivox.AudioPlayer.cache[c.params.id + "PlayOnStartCallback"]))
                chivox.AudioPlayer.cache[c.params.id + "PlayOnStartCallback"](a, e)
        } else if ("50402" === a)
            if (c.__playOrderState = "PLAY_ACT_STOP",
            c.aiDebug.debug("playerEventHandler", a, f),
            "stop.auto" == e.stopType) {
                if ("function" == typeof chivox.AudioPlayer.cache[c.params.id + "PlayOnStopCallback"])
                    chivox.AudioPlayer.cache[c.params.id + "PlayOnStopCallback"](a, e)
            } else {
                if ("stop.manual" == e.stopType && "function" == typeof chivox.AudioPlayer.cache[c.params.id + "ForcePlayOnStopCallback"])
                    chivox.AudioPlayer.cache[c.params.id + "ForcePlayOnStopCallback"](a, e)
            }
        else
            c.aiDebug.debug("UNREGISTERED playerEventHandler", a, f)
    }
    ;
    chivox.AudioPlayer.cache[c.params.id + "OnError"] = function(a, f) {
        f = b(f);
        c.aiDebug.debug("errorEventHandler", a, f);
        if ("50409" === a || "50410" === a)
            chivox.AudioPlayer.cache[c.params.id + "LoadErrorCallback"](a, f);
        if ("function" == typeof c.params.onError)
            c.params.onError(a, f)
    }
    ;
    a = {
        playerType: c.params.playerType,
        flashLoadEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnFlashLoad",
        onPlayerEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnPlayerStateChange",
        errorEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnError"
    };
    var e = {
        param: function(a) {
            var b = [], c;
            for (c in a)
                0 != a.hasOwnProperty(c) && b.push(c + "=" + a[c]);
            return b.join("&").replace(/%20/g, "+")
        }
    }
      , f = c.params.flashPlayerUrl;
    0 == c.params.isCache && (f = f + "?guid=" + 99999999 * Math.random());
    "inux" == navigator.platform.match(/inux/g) ? (a = {
        movie: f,
        width: c.params.width,
        height: c.params.height,
        majorversion: "10",
        build: "0",
        id: c.params.id + "UFO",
        name: c.params.id + "UFO",
        wmode: c.params.wmode,
        allowscriptaccess: "always",
        flashvars: e.param(a)
    },
    UFO.create(a, c.params.id)) : swfobject.embedSWF(f, c.params.id, c.params.width, c.params.height, "10.0.0", c.params.expressInstallUrl, a, {
        allowScriptAccess: "always",
        wmode: c.params.wmode
    }, {
        id: c.params.id,
        name: c.params.id,
        wmode: c.params.wmode
    })
}
;
chivox.AudioPlayer.prototype.__extend = function(a, b) {
    if ("[object Object]" === Object.prototype.toString.call(a) && "[object Object]" === Object.prototype.toString.call(b))
        for (var c in b)
            0 != b.hasOwnProperty(c) && (a[c] = b[c])
}
;
chivox.AudioPlayer.prototype.getAudioPlayer = function() {
    var a = null;
    try {
        a = "inux" == navigator.platform.match(/inux/g) ? document.getElementById(this.params.id + "UFO") : swfobject.getObjectById(this.params.id)
    } catch (b) {}
    return a
}
;
chivox.AudioPlayer.prototype.reset = function() {
    "undefined" != typeof this.synthAjaxId && this.synthAjaxId.abort();
    var a = this.getPlayerStatus();
    "player.playing" != a && "player.bufferring" != a || this.stop();
    this.__playOrderState = "PLAY_INIT"
}
;
chivox.AudioPlayer.prototype.load = function(a) {
    var b = this
      , c = {
        start: "",
        success: "",
        error: ""
    };
    b.__extend(c, a);
    chivox.AudioPlayer.cache[b.params.id + "LoadStartCallback"] = function(a, e) {
        "function" == typeof c.start && c.start(a, e);
        delete this[b.params.id + "LoadStartCallback"]
    }
    ;
    chivox.AudioPlayer.cache[b.params.id + "LoadSuccessCallback"] = function(a, e) {
        "function" == typeof c.success && c.success(a, e);
        delete this[b.params.id + "LoadSuccessCallback"]
    }
    ;
    chivox.AudioPlayer.cache[b.params.id + "LoadErrorCallback"] = function(a, e) {
        "function" == typeof c.error && c.error(a, e);
        delete this[b.params.id + "LoadErrorCallback"]
    }
    ;
    a = b.getAudioPlayer();
    var e = {};
    try {
        e = "undefined" != typeof c.url ? a.loadAudioFromURL(c.url) : a.loadAudioFromByteArray(c.byteData)
    } catch (f) {}
    b.aiDebug.debug("load", c, e);
    return e
}
;
chivox.AudioPlayer.prototype.play = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_START";
    var c = {
        position: "",
        duration: "",
        onStart: "",
        onStop: ""
    };
    b.__extend(c, a);
    isNaN(c.position) && (c.position = "");
    isNaN(c.duration) && (c.duration = "");
    chivox.AudioPlayer.cache[b.params.id + "PlayOnStartCallback"] = function(a, e) {
        if ("function" == typeof c.onStart)
            c.onStart(a, e);
        delete this[b.params.id + "PlayOnStartCallback"]
    }
    ;
    chivox.AudioPlayer.cache[b.params.id + "PlayOnStopCallback"] = function(a, b) {
        if ("function" == typeof c.onStop)
            c.onStop(a, b)
    }
    ;
    a = {};
    if (0 === c.duration)
        return chivox.AudioPlayer.cache[b.params.id + "PlayOnStartCallback"](),
        chivox.AudioPlayer.cache[b.params.id + "PlayOnStopCallback"](),
        a;
    var e = b.getAudioPlayer();
    try {
        a = e.startAudioPlay(c.position, c.duration)
    } catch (f) {}
    b.aiDebug.debug("play", c, a);
    return a
}
;
chivox.AudioPlayer.prototype.stop = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AudioPlayer.cache[b.params.id + "ForcePlayOnStopCallback"] = function(a, e) {
        if ("function" == typeof c.onStop)
            c.onStop(a, e);
        delete this[b.params.id + "ForcePlayOnStopCallback"]
    }
    ;
    a = {};
    var e = b.getAudioPlayer();
    try {
        a = e.stopAudioPlay()
    } catch (f) {}
    b.aiDebug.debug("stop", c, a);
    return a
}
;
chivox.AudioPlayer.prototype.setVolume = function(a) {
    if ("number" == typeof a && !1 === isNaN(a)) {
        0 > a ? a = 0 : 1 < a && (a = 1);
        this.volume = a;
        var b = this.getAudioPlayer();
        try {
            b.adjustVolume(100 * a)
        } catch (c) {}
    }
    this.aiDebug.debug("setVolume", this.volume);
    return this.volume
}
;
chivox.AudioPlayer.prototype.getVolume = function() {
    var a = this.volume;
    this.aiDebug.debug("getVolume", a);
    return a
}
;
chivox.AudioPlayer.prototype.getPosition = function() {
    var a = {}
      , b = this.getAudioPlayer();
    try {
        a = b.getAudioCurrentTime()
    } catch (c) {}
    this.aiDebug.debug("getPosition", a);
    return a
}
;
chivox.AudioPlayer.prototype.getDuration = function() {
    var a = {}
      , b = this.getAudioPlayer();
    try {
        a = b.getAudioTotalTime()
    } catch (c) {}
    this.aiDebug.debug("getDuration", a);
    return a
}
;
chivox.AudioPlayer.prototype.getPlayerStatus = function() {
    var a = "player.unready"
      , b = this.getAudioPlayer();
    try {
        a = b.getPlayerStatus()
    } catch (c) {}
    this.aiDebug.debug("getPlayerStatus", a);
    return a
}
;
chivox.AiRecorder = function() {
    var a = 2400;
    chivox.AiRecorderAs = function(a) {
        function b(a) {
            "string" == typeof a && (a = a.replace(/%22/g, '"').replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%"));
            return a
        }
        this.loaded = this.canRecord = !1;
        this.params = {
            id: "aiRecorder",
            flashRecorderUrl: chivox.host + "/Resources/swf/AudioRecorder4JS_v3.3.2.swf",
            expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
            isCache: !0,
            width: 220,
            height: 140,
            wmode: "Opaque",
            backgroundColor: "0x00ffffff",
            showFlash: !0,
            appKey: "",
            server: "ws://cloud.chivox.com",
            back_server: null,
            userId: "jsssdk-guset-user",
            onFlashLoad: "",
            onConnectorStatusChange: "",
            onMicStatusChange: "",
            onError: "",
            coreTimeout: 6E4,
            logLevel: "DEBUG",
            logTarget: "1",
            language: "zh-CN"
        };
        this.__extend(this.params, a);
        "inux" == navigator.platform.match(/inux/g) && (this.params.wmode = "Window");
        "undefined" == typeof jsReady && (window.jsReady = !1,
        window.jsIsReady = function() {
            return !0
        }
        );
        this.aiDebug = new chivox.AiDebug;
        this.recordIdArr = [];
        this.result = {};
        this.__getScoreTimeoutId = [];
        this.__getScoreTimeoutStartTime = 0;
        this.currentView = {
            meter: {
                x: 0,
                y: -25,
                visible: !0
            },
            slider: {
                x: 0,
                y: 20,
                visible: !0
            },
            viewer: {
                x: 0,
                y: 0,
                visible: !1
            }
        };
        this.noView = {
            meter: {
                x: 0,
                y: -25,
                visible: !1
            },
            slider: {
                x: 0,
                y: 20,
                visible: !1
            },
            viewer: {
                x: 0,
                y: 0,
                visible: !1
            }
        };
        chivox.AiRecorderAs.cache = chivox.AiRecorderAs.cache || {};
        var c = this;
        c.__recordOrderState = "RECORD_INIT";
        c.__replayOrderState = "REPLAY_INIT";
        c.canRecordCheck = {
            flashLoaded: !1,
            serverConnected: !1,
            micAllowed: !1,
            refresh: function() {
                c.canRecord = c.canRecordCheck.flashLoaded && c.canRecordCheck.serverConnected && c.canRecordCheck.micAllowed ? !0 : !1
            }
        };
        chivox.AiRecorderAs.cache[c.params.id + "OnLog"] = function(a) {
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && console.debug(a)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnFlashLoad"] = function(a, e) {
            c.loaded = !0;
            ai$("#" + c.params.id).removeClass("loading");
            e = b(e);
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("flashLoadEventHandler", a, e);
            "50000" === a && (c.canRecordCheck.flashLoaded = !0,
            c.canRecordCheck.refresh());
            "string" == typeof e && (e = JSON.parse(e));
            setTimeout(function() {
                1 == c.params.showFlash && (c.canRecordCheck.micAllowed ? c.showVolumeBar(c.currentView, !1) : c.showVolumeBar(c.noView, !1))
            }, 200);
            "function" == typeof c.params.onFlashLoad && window.setTimeout(function() {
                c.params.onFlashLoad(a, e)
            }, 200)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnConnectorStatusChange"] = function(a, e) {
            e = b(e);
            "50109" == a ? c.canRecordCheck.serverConnected = !1 : "50100" == a ? c.canRecordCheck.serverConnected = !0 : "50101" == a || "50103" == a || "50104" == a ? c.canRecordCheck.serverConnected = !1 : "connection.disconnected" == a && (c.canRecordCheck.serverConnected = !1);
            c.canRecordCheck.refresh();
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("connectorEventHandler", a, e);
            "string" == typeof e && (e = JSON.parse(e));
            "function" == typeof c.params.onConnectorStatusChange && window.setTimeout(function() {
                c.params.onConnectorStatusChange(a, e)
            }, 200)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnMicStatusChange"] = function(a, e) {
            e = b(e);
            "50001" == a ? (c.canRecordCheck.micAllowed = !0,
            c.showVolumeBar(c.currentView, !1)) : "50002" == a ? (c.canRecordCheck.micAllowed = !1,
            c.showVolumeBar(c.noView, !1)) : "50003" == a && (c.canRecordCheck.micAllowed = !1,
            c.showVolumeBar(c.noView, !1));
            c.canRecordCheck.refresh();
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("micEventHandler", a, e);
            "string" == typeof e && (e = JSON.parse(e));
            "function" == typeof c.params.onMicStatusChange && window.setTimeout(function() {
                c.params.onMicStatusChange(a, e)
            }, 200)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnFactoryStateChange"] = function(a, e) {
            e = b(e);
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("factoryEventHandler", a, e);
            "string" == typeof e && (e = JSON.parse(e));
            if ("50500" == a)
                chivox.AiRecorderAs.cache[c.params.id + "OnConnectorStatusChange"]("50100", e);
            else if ("50501" == a)
                chivox.AiRecorderAs.cache[c.params.id + "OnConnectorStatusChange"]("50104", e)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnRecorderStateChange"] = function(a, e) {
            e = b(e);
            var d = "string" == typeof e ? JSON.parse(e) : e;
            if ("50304" == a) {
                if (1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("recorderEventHandler", a, e),
                "function" == typeof chivox.AiRecorderAs.cache[c.params.id + "RecordIdGetted"])
                    chivox.AiRecorderAs.cache[c.params.id + "RecordIdGetted"](a, d)
            } else if ("50300" == a)
                if (c.__recordOrderState = "RECORD_ACT_STOP",
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("recorderEventHandler", a, e),
                chivox.AiRecorderAs.cache[c.params.id + "StartGetScoreTimeStamp"] = (new Date).getTime(),
                "stop.auto" == d.stopType)
                    chivox.AiRecorderAs.cache[c.params.id + "RecordOnStop"](a, d);
                else {
                    if ("stop.manually" == d.stopType)
                        chivox.AiRecorderAs.cache[c.params.id + "ForceRecordOnStop"](a, d)
                }
            else if ("50301" === a)
                "RECORD_CMD_START" == c.__recordOrderState && (c.__recordOrderState = "RECORD_ACT_START",
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("recorderEventHandler", a, e),
                chivox.AiRecorderAs.cache[c.params.id + "RecordOnStart"](a, d));
            else if ("50302" == a)
                if (c.__replayOrderState = "REPLAY_ACT_STOP",
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("recorderEventHandler", a, e),
                "stop.auto" === d.stopType)
                    chivox.AiRecorderAs.cache[c.params.id + "ReplayOnStop"](a, d);
                else {
                    if ("stop.manually" === d.stopType)
                        chivox.AiRecorderAs.cache[c.params.id + "ForceReplayOnStop"](a, d)
                }
            else
                "50303" === a ? "REPLAY_CMD_START" == c.__replayOrderState && (c.__replayOrderState = "REPLAY_ACT_START",
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("recorderEventHandler", a, e),
                chivox.AiRecorderAs.cache[c.params.id + "ReplayOnStart"](a, d)) : 1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("UNREGISTERED recorderEventHandler", a, e)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnCoreRequesterCallback"] = function(a, e, d) {
            e = b(e);
            "function" == typeof c.params.onConnectorStatusChange && 1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("coreRequesterEventHandler", a, e, d);
            "string" == typeof e && (e = JSON.parse(e));
            if ("50200" === a) {
                if (("undefined" != typeof e["Stream-Mode"] || "undefined" != typeof e.tokenId) && ai$.isEmptyObject(d) && "function" == typeof chivox.AiRecorderAs.cache[c.params.id + "RecordOnScore"])
                    chivox.AiRecorderAs.cache[c.params.id + "RecordOnScore"](a, e);
                "string" == typeof e.result && (e.result = JSON.parse(e.result));
                if ("" != e.tokenId && 1 == e.eof)
                    c.result[e.tokenId] = e;
                else if ("function" == typeof chivox.AiRecorderAs.cache[c.params.id + "onInternalScore"])
                    chivox.AiRecorderAs.cache[c.params.id + "onInternalScore"](a, e);
                if ("function" == typeof chivox.AiRecorderAs.cache[c.params.id + "PRCSuccess"])
                    chivox.AiRecorderAs.cache[c.params.id + "PRCSuccess"](a, e, d)
            } else if ("50203" == a && "function" == typeof chivox.AiRecorderAs.cache[c.params.id + "PRCRequestIdGenerated"])
                chivox.AiRecorderAs.cache[c.params.id + "PRCRequestIdGenerated"](a, e, d)
        }
        ;
        chivox.AiRecorderAs.cache[c.params.id + "OnError"] = function(a, e) {
            e = b(e);
            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("errorEventHandler", a, e);
            "string" == typeof e && (e = JSON.parse(e));
            if ("50201" === a)
                "undefined" == typeof c.result[e.tokenId] && (c.result[e.tokenId] = {
                    recordId: e.tokenId
                });
            else if ("50202" === a)
                if ("undefined" != typeof e.tokenId)
                    "undefined" == typeof c.result[e.tokenId] && (c.result[e.tokenId] = e);
                else {
                    if ("function" == typeof chivox.AiRecorderAs.cache[c.params.id + "PRCError"])
                        chivox.AiRecorderAs.cache[c.params.id + "PRCError"](a, e)
                }
            else if ("50104" === a && "function" == typeof c.params.onConnectorStatusChange)
                c.params.onConnectorStatusChange(a, e);
            if ("function" == typeof c.params.onError)
                c.params.onError(a, e)
        }
        ;
        var d = {
            showFlash: c.params.showFlash,
            backgroundColor: c.params.backgroundColor,
            flashLoadEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnFlashLoad",
            jsLogCallback: "chivox.AiRecorderAs.cache." + c.params.id + "OnLog",
            connectorEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnConnectorStatusChange",
            coreRequesterEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnCoreRequesterCallback",
            micEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnMicStatusChange",
            recorderEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnRecorderStateChange",
            factoryEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnFactoryStateChange",
            errorEventHandler: "chivox.AiRecorderAs.cache." + c.params.id + "OnError",
            coreTimeout: c.params.coreTimeout,
            logLevel: c.params.logLevel,
            logTarget: c.params.logTarget,
            appKey: c.params.appKey,
            server: c.params.server,
            language: c.params.language,
            userId: c.params.userId,
            jssdkVersion: c.params.jssdkVersion
        };
        c.params.back_server && (d.back_server = c.params.back_server);
        a = ["connectLocalService", "urlListServiceUrl", "defaultAPIServiceUrlArray", "localServiceUrl", "latencyCheckServiceApplication"];
        for (var g in a) {
            var h = a[g];
            "undefined" != typeof c.params[h] && (d[h] = c.params[h])
        }
        g = chivox.LocationSearch.get();
        if (g.__airecorder) {
            g = g.__airecorder;
            try {
                var l = JSON.parse(decodeURIComponent(g)), k;
                for (k in l)
                    0 != l.hasOwnProperty(k) && "undefined" !== typeof l[k] && (d[k] = l[k])
            } catch (n) {
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("Invalid __airecorder params.")
            }
        }
        var q = {
            param: function(a) {
                var c = [], b;
                for (b in a)
                    0 != a.hasOwnProperty(b) && "undefined" !== typeof a[b] && c.push(b + "=" + a[b]);
                return c.join("&").replace(/%20/g, "+")
            }
        };
        0 == c.params.isCache && (c.params.flashRecorderUrl = c.params.flashRecorderUrl + "?guid=" + 99999999 * Math.random());
        l = function() {
            d.timestamp = this.params.timestamp;
            d.sig = this.params.sig;
            if ("inux" == navigator.platform.match(/inux/g)) {
                var a = {
                    movie: c.params.flashRecorderUrl,
                    width: c.params.width,
                    height: c.params.height,
                    majorversion: "10",
                    build: "0",
                    id: c.params.id + "UFO",
                    name: c.params.id + "UFO",
                    wmode: c.params.wmode,
                    allowscriptaccess: "always",
                    flashvars: q.param(d)
                };
                UFO.create(a, c.params.id)
            } else {
                a = {
                    allowScriptAccess: "always",
                    wmode: c.params.wmode
                };
                var b = {
                    id: c.params.id,
                    name: c.params.id,
                    wmode: c.params.wmode
                }, e;
                for (e in d)
                    "undefined" === typeof d[e] && delete d[e];
                swfobject.embedSWF(c.params.flashRecorderUrl, c.params.id, c.params.width, c.params.height, "10.0.0", c.params.expressInstallUrl, d, a, b, function(a) {
                    1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && console.info("[ embedSWF ]:", a)
                });
                ai$("#" + c.params.id).addClass("loading");
                1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && console.info("[ _init ]: here", c.params.id, d)
            }
        }
        ;
        this.params.hasOwnProperty("sig") && this.params.hasOwnProperty("timestamp") ? l() : this.getSig(l, d)
    }
    ;
    chivox.AiRecorderAs.prototype.__extend = function(a, b) {
        if ("[object Object]" === Object.prototype.toString.call(a) && "[object Object]" === Object.prototype.toString.call(b))
            for (var c in b)
                0 != b.hasOwnProperty(c) && (a[c] = b[c])
    }
    ;
    chivox.AiRecorderAs.prototype.getLastRecordId = function() {
        var a = null
          , b = this.recordIdArr.length;
        0 < b && (a = this.recordIdArr[b - 1]);
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getLastRecordId", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getAudioRecorder = function() {
        var a = null;
        try {
            a = "inux" == navigator.platform.match(/inux/g) ? document.getElementById(this.params.id + "UFO") : document.getElementById(this.params.id)
        } catch (e) {}
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.reset = function() {
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("AiRecorder.reset: this will clearTimeout in getScores.");
        for (var a in this.__getScoreTimeoutId)
            0 != this.__getScoreTimeoutId.hasOwnProperty(a) && window.clearTimeout(this.__getScoreTimeoutId[a]);
        this.__getScoreTimeoutId = [];
        this.__getScoreTimeoutStartTime = 0;
        a = this.getRecorderStatus();
        "recorder.recording" == a || "recorder.waiting.to.start.recording" == a ? this.stop() : "recorder.replaying" == a && this.stopReplay();
        this.__recordOrderState = "RECORD_INIT";
        this.__replayOrderState = "REPLAY_INIT"
    }
    ;
    chivox.AiRecorderAs.prototype.getSig = function(a, b) {
        if ("" == this.params.sigurl) {
            if ("function" == typeof this.params.onError)
                this.params.onError(-1, "sigurl not set!");
            else
                console.error("sigurl not set!");
            return !1
        }
        var c = this;
        ai$.getJSON(this.params.sigurl, {
            alg: this.params.alg
        }, function(e) {
            c.params.timestamp = e.timestamp;
            c.params.sig = e.sig;
            void 0 !== a && a.call(c, b)
        })
    }
    ;
    chivox.AiRecorderAs.prototype.record = function(c) {
        var b = this;
        b.__recordOrderState = "RECORD_CMD_START";
        var f = {
            duration: 5E3,
            playNotifyAudio: !0,
            serverParams: {},
            onRecordIdGenerated: "",
            onStart: "",
            onStop: "",
            onScore: "",
            onInternalScore: ""
        }
          , d = Math.floor((new Date).getTime());
        if ("" === b.params.sig || void 0 === b.params.timestamp || parseInt(b.params.timestamp) < d - 1E3 * a)
            this.getSig(b.record, c);
        else {
            b.__extend(f, c);
            !0 === isNaN(f.duration) && (f.duration = 5E3);
            "boolean" != typeof f.playNotifyAudio && (f.playNotifyAudio = !0);
            "en.word.score" == f.serverParams.coreType || "en.sent.score" == f.serverParams.coreType || "en.sent.recscore" == f.serverParams.coreType || "cn.word.score" == f.serverParams.coreType || "cn.sent.score" == f.serverParams.coreType ? (c = 100,
            "undefined" != typeof f.serverParams.scoreType && (c = f.serverParams.scoreType),
            "undefined" != typeof f.serverParams.rank && (c = f.serverParams.rank),
            f.serverParams.rank = f.serverParams.scoreType = c) : "en.sent.rec" == f.serverParams.coreType ? f.serverParams.language = "english" : "cn.sent.rec" == f.serverParams.coreType && (f.serverParams.language = "chinese");
            "undefined" == typeof f.serverParams.userId && (f.serverParams.userId = b.params.userId);
            chivox.AiRecorderAs.cache[b.params.id + "RecordIdGetted"] = function(a, c) {
                c.recordId = c.tokenId;
                b.recordIdArr.push(c.tokenId);
                if ("function" == typeof f.onRecordIdGenerated)
                    f.onRecordIdGenerated(a, c)
            }
            ;
            chivox.AiRecorderAs.cache[b.params.id + "RecordOnStart"] = function(a, c) {
                if ("function" == typeof f.onStart)
                    f.onStart(a, c)
            }
            ;
            chivox.AiRecorderAs.cache[b.params.id + "RecordOnStop"] = function(a, c) {
                if ("function" == typeof f.onStop)
                    f.onStop(a, c)
            }
            ;
            chivox.AiRecorderAs.cache[b.params.id + "RecordOnScore"] = function(a, c) {
                if ("function" == typeof f.onScore)
                    f.onScore(a, c)
            }
            ;
            chivox.AiRecorderAs.cache[b.params.id + "onInternalScore"] = function(a, c) {
                if ("function" == typeof f.onInternalScore)
                    f.onInternalScore(a, c)
            }
            ;
            f.serverParams.applicationId = b.params.appKey;
            f.serverParams.sig = b.params.sig;
            f.serverParams.timestamp = b.params.timestamp;
            c = {
                serverParam: f.serverParams,
                recordLength: f.duration,
                virtualDirectory: "",
                isVADEnabled: !1,
                silenceLevel: "0",
                playDing: f.playNotifyAudio
            };
            d = {};
            var g = b.getAudioRecorder();
            try {
                d = g.startRecord(c)
            } catch (h) {}
            1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("record", f, d);
            return d
        }
    }
    ;
    chivox.AiRecorderAs.prototype.stop = function(a) {
        var c = this;
        c.__recordOrderState = "RECORD_CMD_STOP";
        var b = {
            onStop: ""
        };
        c.__extend(b, a);
        chivox.AiRecorderAs.cache[c.params.id + "ForceRecordOnStop"] = function(a, e) {
            if ("function" == typeof b.onStop)
                b.onStop(a, e);
            delete this[c.params.id + "ForceRecordOnStop"]
        }
        ;
        a = {};
        var d = {}
          , g = c.getAudioRecorder();
        try {
            a = g.stopRecord(d)
        } catch (h) {}
        1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && c.aiDebug.debug("stop", b, a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.startReplay = function(a) {
        var b = this;
        b.__replayOrderState = "REPLAY_CMD_START";
        var c = {
            recordId: b.getLastRecordId(),
            onStop: ""
        };
        b.__extend(c, a);
        chivox.AiRecorderAs.cache[b.params.id + "ReplayOnStart"] = function(a, e) {
            delete this[b.params.id + "ReplayOnStart"];
            if ("function" == typeof c.onStart)
                c.onStart(a, e)
        }
        ;
        chivox.AiRecorderAs.cache[b.params.id + "ReplayOnStop"] = function(a, e) {
            delete this[b.params.id + "ReplayOnStop"];
            if ("function" == typeof c.onStop)
                c.onStop(a, e)
        }
        ;
        var d = {
            tokenId: c.recordId
        };
        if ("undefined" != typeof a.startPos && "undefined" != typeof a.stopPos) {
            var g = parseInt(0 < a.expand ? a.expand : 0)
              , h = parseInt(0 < a.startPos ? a.startPos : 0);
            a = parseInt(0 < a.stopPos ? a.stopPos : 0);
            d.startPos = 0 < h - g ? h - g : 0;
            d.stopPos = 0 < a + g ? a + g : 100
        }
        g = {};
        h = b.getAudioRecorder();
        try {
            g = h.startReplay(d)
        } catch (l) {}
        1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("startReplay", c, g);
        return g
    }
    ;
    chivox.AiRecorderAs.prototype.stopReplay = function(a) {
        var b = this;
        b.__replayOrderState = "REPLAY_CMD_STOP";
        var c = {
            onStop: ""
        };
        b.__extend(c, a);
        chivox.AiRecorderAs.cache[b.params.id + "ForceReplayOnStop"] = function(a, e) {
            if ("function" == typeof c.onStop)
                c.onStop(a, e);
            delete this[b.params.id + "ForceReplayOnStop"]
        }
        ;
        a = {};
        var d = {}
          , g = b.getAudioRecorder();
        try {
            a = g.stopReplay(d)
        } catch (h) {}
        1 == b.params.debugInfo && "boolean" == typeof b.params.debugInfo && b.aiDebug.debug("stopReplay", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getScores = function(a) {
        this.__getScoreTimeoutStartTime = (new Date).getTime();
        this.__getScores(a)
    }
    ;
    chivox.AiRecorderAs.prototype.__getScores = function(a) {
        var b = a.recordId;
        if ("undefined" === typeof b || null === b || "" === b)
            "function" == typeof a.success && (a.success(this.result),
            1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("==== getScores end ===="));
        else if ("string" == typeof b)
            if ("undefined" != typeof this.result[b]) {
                var c = {};
                c[b] = this.result[b];
                "function" == typeof a.success && (a.success(c),
                1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("==== getScores end ===="))
            } else
                (new Date).getTime() - this.__getScoreTimeoutStartTime >= this.params.coreTimeout && (this.result[b] = {
                    recordId: b,
                    result: {
                        errID: "50201",
                        error: {
                            tip: "JSSDK getScore timeout",
                            errMsg: "JSSDK getScore timeout"
                        }
                    }
                }),
                function(a, b) {
                    a.__getScoreTimeoutId.push(window.setTimeout(function() {
                        a.__getScores(b)
                    }, 200))
                }(this, a);
        else if ("[object Array]" === Object.prototype.toString.call(b)) {
            c = {};
            var d = !0, g;
            for (g in b)
                if (0 != b.hasOwnProperty(g)) {
                    var h = b[g];
                    if ("undefined" != typeof this.result[h])
                        c[h] = this.result[h];
                    else {
                        if ((new Date).getTime() - this.__getScoreTimeoutStartTime < this.params.coreTimeout)
                            d = !1,
                            function(a, b) {
                                a.__getScoreTimeoutId.push(window.setTimeout(function() {
                                    a.__getScores(b)
                                }, 200))
                            }(this, a);
                        else {
                            d = !0;
                            for (var l in b)
                                0 != b.hasOwnProperty(l) && (h = b[l],
                                "undefined" == typeof this.result[h] && (this.result[h] = {
                                    recordId: h,
                                    result: {
                                        errID: "50201",
                                        error: {
                                            tip: "JSSDK getScore timeout",
                                            errMsg: "JSSDK getScore timeout"
                                        }
                                    }
                                },
                                c[h] = this.result[h]))
                        }
                        break
                    }
                }
            d && "function" == typeof a.success && (a.success(c),
            1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("==== getScores end ===="))
        }
    }
    ;
    chivox.AiRecorderAs.prototype.getMicStatus = function() {
        var a = "microphone.not.ready"
          , b = this.getAudioRecorder();
        try {
            a = b.getMicStatus()
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getMicStatus", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getRecorderStatus = function() {
        var a = "recorder.not.ready"
          , b = this.getAudioRecorder();
        try {
            a = b.getRecorderStatus()
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getRecorderStatus", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getConnectorStatus = function() {
        var a = "connection.not.ready"
          , b = this.getAudioRecorder();
        try {
            a = b.getConnectorStatus()
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getConnectorStatus", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getCoreRequesterStatus = function() {
        var a = "corerequester.not.ready"
          , b = this.getAudioRecorder();
        try {
            a = b.getCoreRequesterStatus()
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getCoreRequesterStatus", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.setNotifyAudioVolume = function(a) {
        if ("number" == typeof a && !1 === isNaN(a)) {
            var b = this.getAudioRecorder();
            try {
                b.adjustNotifyAudioVolume(100 * a)
            } catch (f) {}
        }
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("setNotifyAudioVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getNotifyAudioVolume = function() {
        var a = null
          , b = this.getAudioRecorder();
        try {
            a = b.getNotifyAudioVolume() / 100
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("getNotifyAudioVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.showFlash = function() {
        var a = this.getAudioRecorder();
        try {
            a.showFlash()
        } catch (e) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("showFlash")
    }
    ;
    chivox.AiRecorderAs.prototype.transparentFlash = function() {
        var a = this.getAudioRecorder();
        try {
            a.transparentFlash()
        } catch (e) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("transparentFlash")
    }
    ;
    chivox.AiRecorderAs.prototype.showVolumeBar = function(a, b) {
        var c = this.getAudioRecorder()
          , e = {
            meter: {
                x: 0,
                y: -25,
                visible: !1
            },
            slider: {
                x: 0,
                y: 20,
                visible: !1
            },
            viewer: {
                x: 0,
                y: 0,
                visible: !0
            }
        };
        "undefined" != typeof a && this.__extend(e, a);
        if ("undefined" == typeof b || 1 == b)
            this.currentView = e;
        if (this.canRecordCheck.micAllowed || 0 == b) {
            try {
                c.showVolumeBar(e)
            } catch (g) {}
            1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("showVolumeBar")
        }
    }
    ;
    chivox.AiRecorderAs.prototype.hideVolumeBar = function() {
        var a = this.getAudioRecorder()
          , b = {
            meter: {
                x: 0,
                y: -20,
                visible: !0
            },
            slider: {
                x: 0,
                y: 20,
                visible: !0
            },
            viewer: {
                x: 0,
                y: 0,
                visible: !1
            }
        };
        this.currentView = b;
        if (this.canRecordCheck.micAllowed) {
            try {
                a.showVolumeBar(b)
            } catch (f) {}
            1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("hideVolumeBar")
        }
    }
    ;
    chivox.AiRecorderAs.prototype.setMicVolume = function(a) {
        if ("number" == typeof a && !1 === isNaN(a)) {
            0 > a ? a = 0 : 1 < a && (a = 1);
            var b = this.getAudioRecorder();
            try {
                b.adjustMicVolume(100 * a)
            } catch (f) {}
        }
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("recorder adjustMicVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getMicVolume = function() {
        var a = null
          , b = this.getAudioRecorder();
        try {
            a = b.getMicVolume() / 100
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("recorder getMicVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.setVolume = function(a) {
        if ("number" == typeof a && !1 === isNaN(a)) {
            0 > a ? a = 0 : 1 < a && (a = 1);
            var b = this.getAudioRecorder();
            try {
                b.adjustReplayAudioVolume(100 * a)
            } catch (f) {}
        }
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("recorder adjustReplayAudioVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getVolume = function() {
        var a = null
          , b = this.getAudioRecorder();
        try {
            a = b.getReplayAudioVolume() / 100
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("recorder getVolume", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.getMicActivityLevel = function() {
        var a = null
          , b = this.getAudioRecorder();
        try {
            a = b.getMicActivityLevel()
        } catch (f) {}
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("recorder getMicActivityLevel", a);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.reconnect = function() {
        var a = this.getAudioRecorder();
        try {
            a.reconnect()
        } catch (e) {}
    }
    ;
    chivox.AiRecorderAs.prototype.disconnect = function() {
        var a = this.getAudioRecorder();
        try {
            a.disconnect(),
            chivox.AiRecorderAs.cache[this.params.id + "OnConnectorStatusChange"]("connection.disconnected", {
                error: "no message"
            })
        } catch (e) {}
    }
    ;
    chivox.AiRecorderAs.prototype.getState = function() {
        var a = {}
          , b = this.getAudioRecorder();
        try {
            a = b.getState()
        } catch (f) {}
        "http://127.0.0.1:5768" == a.connection.uri && (a.connection.latency = 100,
        a.connection.throughput = 1E7);
        return a
    }
    ;
    chivox.AiRecorderAs.prototype.rpc = function(a, b, f) {
        var c = "";
        chivox.AiRecorderAs.cache[this.params.id + "PRCRequestIdGenerated"] = function(a, b, c) {
            if ("undefined" != typeof f && "function" == typeof f.onRequestIdGenerated)
                f.onRequestIdGenerated(a, b, c)
        }
        ;
        chivox.AiRecorderAs.cache[this.params.id + "PRCSuccess"] = function(a, b, c) {
            "undefined" != typeof f && "function" == typeof f.success && f.success(a, b, c)
        }
        ;
        chivox.AiRecorderAs.cache[this.params.id + "PRCError"] = function(a, b) {
            "undefined" != typeof f && "function" == typeof f.error && f.error(a, b)
        }
        ;
        var e = this.getAudioRecorder();
        console.warn(e);
        try {
            c = e.rpc(a, b)
        } catch (h) {
            console.error(h)
        }
        1 == this.params.debugInfo && "boolean" == typeof this.params.debugInfo && this.aiDebug.debug("rpc", a, b);
        return c
    }
    ;
    var b = function(b) {
        var c = this
          , f = chivox.host + "/Classes/H5/audio/vad.js"
          , d = chivox.host + "/Classes/H5/audio/recorderWorker.js";
        this.audio = document.createElement("audio");
        this.getInputPoint = null;
        this.dictResults = {};
        this._onscore_time_out = this.__durationTimer = this.__onStopReplay = null;
        this.params = {
            id: "aiRecorder",
            appKey: "",
            alg: "sha1",
            sigurl: "",
            sigTimeOut: 2400,
            userId: "",
            encode: "raw",
            server: "https:" == document.location.protocol ? "wss://cloud.chivox.com" : "ws://cloud.chivox.com",
            debugInfo: !0,
            micWatch: !1,
            originalResult: !1,
            coreTimeout: 6E4,
            onStartReplay: function() {},
            onStopReplay: function() {
                "function" == typeof c.__onStopReplay && c.__onStopReplay()
            },
            onGetResult: function(a) {},
            onError: function(a) {
                console.error(a)
            },
            onVolume: function() {},
            onFlashLoad: function(a, b) {
                console.log(a)
            },
            onInitSuccess: function() {
                b.params.onInitSuccess()
            },
            onConnectorStatusChange: function(a, b) {},
            onMicStatusChange: function(a, b) {},
            onRecordIdGenerated: function(a, b) {},
            onStart: function(a, b) {},
            onStop: function(a, b) {},
            onInternalScore: function(a, b) {}
        };
        b.hasOwnProperty("signature") && (this.params.signature = null);
        this.showVolumeBar = function() {}
        ;
        var g = function(a, c) {
            if (!a && (console.error(c),
            "undefined" != typeof b.onError))
                b.onError(c);
            return a
        };
        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia;
        if (g("https:" == document.location.protocol, "[ AiRecorderH5 ]ERROR: \u5f53\u524d\u9875\u9762\u4f7f\u7528\u7684\u4e0d\u662fhttps\u534f\u8bae\uff0cHTML5\u6a21\u5f0f\u53ea\u80fd\u5728HTTPS\u534f\u8bae\u4e0b\u4f7f\u7528\u3002") && g(window.WebSocket, "[ AiRecorderH5 ]ERROR: \u6d4f\u89c8\u5668\u4e0d\u652f\u6301websocket.") && g(window.Worker, "[ AiRecorderH5 ]ERROR: \u6d4f\u89c8\u5668\u4e0d\u652f\u6301Worker.") && g(navigator.getMedia, "[ AiRecorderH5 ]ERROR: \u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u5f55\u97f3.")) {
            b.server && "wss" != b.server.substr(0, 3) && (console.warn("[ AiRecorderH5 ]ERROR: HTML5\u6a21\u5f0f\u53ea\u80fd\u8fde\u63a5WSS\u534f\u8bae\uff0c\u5f53\u524dserver(" + b.server + ")\u4e0d\u53ef\u7528\uff0c\u4f7f\u7528\u9ed8\u8ba4server\u5730\u5740\uff1a" + c.params.server),
            delete b.server);
            this.compress = this.record_worker = this.vad_worker = null;
            ai$.get(f, function(a) {
                c.vad_worker = new Worker(window.URL.createObjectURL(new Blob([a])))
            }).done(function() {
                ai$.get(d, function(a) {
                    c.record_worker = new Worker(window.URL.createObjectURL(new Blob([a])))
                }).done(function() {
                    1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && console.debug("[ AiRecorderH5 ]: record worker started.");
                    if ("raw" != c.params.encode) {
                        var a = chivox.host + "/Classes/H5/audio/speex.js";
                        ai$.get(a, function(a) {
                            c.compress = new Worker(window.URL.createObjectURL(new Blob([a])));
                            c.engine = new k(c);
                            1 == c.params.debugInfo && "boolean" == typeof c.params.debugInfo && console.debug("[ AiRecorderH5 ]: speex worker started.")
                        }).fail(function(b, c) {
                            console.error("[ AiRecorderH5 ]: speex worker start failed from url: " + a, "status:", c)
                        })
                    } else
                        c.engine = new k(c)
                }).fail(function(a, b) {
                    console.error("[ AiRecorderH5 ]: record worker start failed from url: " + d, "status:", b)
                })
            }).fail(function(a, b) {
                console.error("[ AiRecorderH5 ]: vad worker start failed from url: " + f, "status:", b)
            });
            this.canRecord = !1;
            if ("undefined" != typeof b)
                for (var h in b)
                    c.params.hasOwnProperty(h) && (c.params[h] = b[h]);
            var l = document.getElementById(c.params.id);
            this.volumeBar = document.createElement("canvas");
            l.appendChild(this.volumeBar);
            this.Recorder = function(a, b, c) {
                var d = c || {};
                c = /(Win(dows )?NT 6\.2)/.test(navigator.userAgent) ? 1024 : /(Win(dows )?NT 6\.1)/.test(navigator.userAgent) ? 1024 : /(Win(dows )?NT 6\.0)/.test(navigator.userAgent) ? 2048 : /Win(dows )?(NT 5\.1|XP)/.test(navigator.userAgent) ? 4096 : /Mac|PPC/.test(navigator.userAgent) ? 1024 : /Linux/.test(navigator.userAgent) ? 8192 : /iPhone|iPad|iPod/.test(navigator.userAgent) ? 2048 : 16384;
                new Int8Array(258);
                var e = d.compressPath;
                this.context = a.context;
                this.node = this.context.createScriptProcessor(c, 1, 1);
                var f = b.record_worker
                  , g = null
                  , t = null
                  , h = null
                  , u = null
                  , k = null
                  , r = null
                  , l = null
                  , m = 0
                  , n = 0
                  , q = 0
                  , p = !1
                  , v = !1;
                f.postMessage({
                    command: "init",
                    config: {
                        compressPath: e,
                        sampleRate: this.context.sampleRate,
                        outputBufferLength: c
                    }
                });
                this.node.onaudioprocess = function(a) {
                    a = a.inputBuffer.getChannelData(0);
                    if (0 === Math.max.apply(Math, a) && b.params.micWatch && "boolean" === typeof b.params.micWatch && (m++,
                    2 === m && (b.canRecord = !1,
                    p && (b.engine.stopRecord(!0),
                    p = !1),
                    b.__durationTimer && clearTimeout(b.__durationTimer),
                    b.engine && b.engine.retTimer && clearTimeout(b.engine.retTimer),
                    b._onscore_time_out && clearTimeout(b._onscore_time_out),
                    "function" == typeof b.params.onError)))
                        b.params.onError("50003", "no audio device");
                    p && f.postMessage({
                        command: "record",
                        buffer: a
                    })
                }
                ;
                this.configure = function(a) {
                    for (var b in a)
                        a.hasOwnProperty(b) && (d[b] = a[b])
                }
                ;
                this.addCallback = function(a, b, c, d, e) {
                    t = a;
                    g = b;
                    h = c;
                    u = d;
                    k = e
                }
                ;
                this.startRecord = function() {
                    p && console.warn("[startRecord]: is recording......;startRecord fail");
                    p = !0;
                    v = !1;
                    b.recordIngCount++;
                    f.postMessage({
                        command: "reset"
                    });
                    r = b.vad_worker;
                    r.postMessage({
                        command: "init"
                    });
                    r.onmessage = function(a) {
                        "debug" != a.data.type && "esvad" == a.data.command && h(a.data.message)
                    }
                    ;
                    b.compress && (l = b.compress,
                    l.postMessage({
                        command: "init"
                    }),
                    l.onmessage = function(a) {
                        "debug" != a.data.type && "encode" == a.data.command && (++q,
                        a = a.data.buffer[0],
                        0 < a.length && g(0, a),
                        p || q != n || (v = !0,
                        g(1, null)))
                    }
                    )
                }
                ;
                this.stopRecord = function() {
                    p && (p = !1,
                    v || q != n || g(1, null),
                    f.postMessage({
                        command: "exportAudio",
                        type: "wav"
                    }))
                }
                ;
                this.isRecording = function() {
                    return p
                }
                ;
                this.startReplay = function() {
                    if (b.audio || b.audio.src)
                        b.audio.play(),
                        u("replay start");
                    else
                        throw Error("no record audio");
                }
                ;
                this.stopReplay = function() {
                    b.audio && b.audio.src && (b.audio.pause(),
                    b.audio.currentTime = 0,
                    k("replay stop"))
                }
                ;
                f.onmessage = function(a) {
                    if ("debug" != a.data.command)
                        if ("blob" == a.data.command) {
                            try {
                                var c = new FileReader;
                                c.onload = function(a) {
                                    b.audio.src = a.target.result
                                }
                                ;
                                c.readAsDataURL(a.data.blob)
                            } catch (w) {
                                console.log(w)
                            }
                            b.audio.type = "audio/wav";
                            b.audio.loop = !1;
                            b.audio.addEventListener("ended", function() {
                                k("replay stop")
                            }, !1)
                        } else {
                            t(a.data.volume);
                            a = a.data.buffer;
                            c = new Int16Array(a.length);
                            for (var d = 0; d < a.length; d++)
                                c[d] = a[d];
                            r.postMessage({
                                command: "appendData",
                                pcm: c,
                                nSamples: c.length
                            });
                            null != l ? (l.postMessage({
                                command: "encode",
                                pcm: c
                            }),
                            ++n) : g(0, c)
                        }
                }
                ;
                a.connect(this.node);
                this.node.connect(this.context.destination);
                return this
            }
            ;
            var k = function(a) {
                1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ AiRecorderH5 ]: Begin init enigine...");
                this.wsBuffer = this.params = this.webSocket = null;
                this.recBuffers = [];
                this.count = 0;
                this.retTimer = null;
                this.scoreTimes = 0;
                var b = this;
                this.audioRecorder = this.analyserNode = this.inputPoint = this.realAudioInput = this.audioInput = null;
                this.cfg = a.params;
                this._ding_player = new chivox.AiPlayer({
                    mode: chivox.MODE.HTML5
                });
                navigator.getUserMedia || (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia);
                navigator.cancelAnimationFrame || (navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame);
                navigator.requestAnimationFrame || (navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame);
                window.AudioContext || (window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.msAudioContext);
                this.gotStream = function(b) {
                    this.audioContext = new window.AudioContext;
                    this.audioContext || (console.error('["audioContextError"]:no audio context!'),
                    this.cfg.onError("no audio context!"));
                    this.inputPoint = this.audioContext.createGain();
                    a.getInputPoint = this.inputPoint;
                    this.cfg.onFlashLoad(5E4);
                    this.audioInput = this.realAudioInput = this.audioContext.createMediaStreamSource(b);
                    this.audioInput.connect(this.inputPoint);
                    this.analyserNode = this.audioContext.createAnalyser();
                    this.analyserNode.fftSize = 2048;
                    this.inputPoint.connect(this.analyserNode);
                    this.audioRecorder = new a.Recorder(this.inputPoint,a);
                    a.canRecord = !0;
                    this.audioRecorder.addCallback(this.cfg.onVolume, this.sendAudio.bind(this), this.vadCheck, this.cfg.onStartReplay, this.cfg.onStopReplay);
                    "function" == typeof a.params.onInitSuccess && (console.debug("[AiRecorderH5]: record init success"),
                    a.params.onInitSuccess())
                }
                ;
                this.connectWebSocket = function(c) {
                    var d = this
                      , e = ("undefined" == typeof c.res ? this.cfg.server + "/" + c.coreType : this.cfg.server + "/" + c.coreType + "/" + c.res) + "?e=0&t=0&version=2";
                    1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ connectWebSocket ]: begin connect to:", e);
                    this.webSocket = new WebSocket(e);
                    a.log(1, 19, e, "");
                    this.webSocket.onopen = function(b) {
                        1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ onopen ]: Connection made to: " + e);
                        b = JSON.stringify(d.createParams(0, c));
                        this.send(b);
                        for (b = 0; b < d.wsBuffer.length; b++)
                            this.send(d.wsBuffer[b]);
                        d.wsBuffer.length = 0;
                        a.log(1, 15, e, "")
                    }
                    ;
                    this.webSocket.onclose = function(b) {
                        1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("Close connection to websocket");
                        a.log(1, 17, e, "")
                    }
                    ;
                    this.webSocket.onmessage = function(c) {
                        clearTimeout(d.retTimer);
                        b.scoreTimes = (new Date).getTime();
                        1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ onmessage ]", c.data);
                        var e = c.data;
                        c = JSON.parse(e);
                        if (c.hasOwnProperty("error"))
                            d.stopRecord(!0),
                            a.dictResults.error = c,
                            console.error('["onmessage"]:' + JSON.stringify(c));
                        else if (c.result.hasOwnProperty("snt"))
                            d.cfg.onInternalScore(0, c);
                        else
                            e = 1 == a.params.originalResult ? e : c,
                            c && !c.hasOwnProperty("tokenId") && (a.dictResults.jsonFlag = e),
                            a.dictResults[c.tokenId] = e,
                            d.cfg.onGetResult(e)
                    }
                    ;
                    this.webSocket.onerror = function(b) {
                        "function" == typeof stopRecord && a.stop();
                        b.data ? (console.debug("['websocketError']:" + b.data),
                        a.params.onError(b.data)) : (console.debug("websocket error"),
                        a.params.onError("default", "websocket error"));
                        a.log(1, 16, e, b.data)
                    }
                }
                ;
                this.disconnectWebSocket = function() {
                    this.webSocket.close()
                }
                ;
                this.changeCoreType = function(a) {
                    this.disconnectWebSocket();
                    this.connectWebSocket(a)
                }
                ;
                this.createParams = function(b, c) {
                    var d = c.timestamp
                      , e = c.sig;
                    0 == b ? b = {
                        sdk: {
                            version: 16777216,
                            source: 4,
                            protocol: "websocket"
                        },
                        app: {
                            applicationId: this.cfg.appKey,
                            sig: e,
                            alg: this.cfg.alg,
                            timestamp: d,
                            userId: this.cfg.userId
                        }
                    } : (a.params.sigTimeOut && -1 == a.params.sigTimeOut && (c.app = {
                        sig: c.sig,
                        timestamp: c.timestamp,
                        userId: c.userId,
                        applicationId: this.cfg.appKey
                    }),
                    b = {
                        tokenId: this.createUUID(),
                        audio: {
                            audioType: "raw" == this.cfg.encode ? "wav" : "spx",
                            channel: 1,
                            sampleBytes: 2,
                            sampleRate: 16E3
                        },
                        request: c
                    },
                    "undefined" != typeof c.precision && (b.request.precision = c.precision),
                    a.params.onRecordIdGenerated(0, {
                        recordId: b.tokenId
                    }));
                    return b
                }
                ;
                this.startRecord = function(b) {
                    if (this.audioRecorder.isRecording())
                        console.warn("please wait last record end!"),
                        this.cfg.onError("please wait last record end!");
                    else {
                        this.wsBuffer = [];
                        var c = (new Date).getTime();
                        null == this.params ? (this.params = b,
                        this.connectWebSocket(b)) : this.params.coreType != b.coreType ? (this.params = b,
                        this.changeCoreType(b)) : this.webSocket.readyState != WebSocket.OPEN ? (this.params = b,
                        this.connectWebSocket(b)) : this.params.res != b.res ? (this.params = b,
                        this.changeCoreType(b)) : 45E3 < c - this.scoreTimes && (this.params = b,
                        this.changeCoreType(b));
                        if (null == this.audioRecorder)
                            console.error("no input device!"),
                            this.cfg.onError("no input device!");
                        else if (c = JSON.stringify(this.createParams(1, b)),
                        this.webSocket.readyState == WebSocket.OPEN ? this.webSocket.send(c) : this.wsBuffer.push(c),
                        this.recBuffers = [],
                        1 == b.playNotifyAudio && "boolean" == typeof b.playNotifyAudio) {
                            var d = this;
                            this._ding_player.load({
                                url: chivox.host + "/assets/audio/ding.mp3",
                                success: function() {
                                    d._ding_player.play({
                                        onStop: function() {
                                            "undefined" !== typeof b.duration && (a.__durationTimer = setTimeout(a.stop, b.duration));
                                            d.enterRecord();
                                            1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ startRecord ]: ", b)
                                        }
                                    })
                                }
                            })
                        } else
                            "undefined" !== typeof b.duration && (a.__durationTimer = setTimeout(a.stop, b.duration)),
                            this.enterRecord(),
                            1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ startRecord ]: ", b)
                    }
                }
                ;
                this.enterRecord = function() {
                    this.audioRecorder.startRecord();
                    a.params.onStart()
                }
                ;
                this.stopRecord = function(b) {
                    if (this.audioRecorder.isRecording()) {
                        this.audioRecorder.stopRecord();
                        if (!b) {
                            var c = this;
                            this.retTimer = setTimeout(function() {
                                c.onTimeout()
                            }, this.cfg.coreTimeout)
                        }
                        a.params.onStop()
                    }
                }
                ;
                this.startReplay = function() {
                    this.audioRecorder.startReplay()
                }
                ;
                this.stopReplay = function() {
                    this.audioRecorder.stopReplay()
                }
                ;
                this.sendAudio = function(a, b) {
                    this.count++;
                    1 != a && this.recBuffers.push(b);
                    if (1 == a || 6 == this.count) {
                        if (0 < this.recBuffers.length) {
                            b = this.recBuffers.splice(0, this.recBuffers.length);
                            var c;
                            if ("raw" != this.cfg.encode) {
                                var d = new Uint8Array(70 * b.length);
                                for (c = 0; c < b.length; c++)
                                    d.set(b[c], 70 * c)
                            } else
                                for (d = new Int16Array(320 * b.length),
                                c = 0; c < b.length; c++)
                                    d.set(b[c], 320 * c);
                            this.webSocket.readyState == WebSocket.OPEN ? this.webSocket.send(d.buffer) : this.wsBuffer.push(d.buffer)
                        }
                        this.count = 0;
                        1 == a && (this.webSocket.readyState == WebSocket.OPEN ? this.webSocket.send(new ArrayBuffer(0)) : this.wsBuffer.push(new ArrayBuffer(0)))
                    }
                }
                ;
                this.vadCheck = function(b) {
                    1 == a.params.debugInfo && "boolean" == typeof a.params.debugInfo && console.debug("[ vadCheck ]: detect record stop, but ignore it now...")
                }
                ;
                this.onTimeout = function() {}
                ;
                this.createUUID = function(a, b) {
                    return function() {
                        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(a, b).toUpperCase()
                    }
                }(/[xy]/g, function(a) {
                    var b = 16 * Math.random() | 0;
                    return ("x" == a ? b : b & 3 | 8).toString(16)
                });
                navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
                    audio: !0
                }).then(this.gotStream.bind(this)).catch(function(b) {
                    a.params.onError("50003", "no audio device");
                    console.error("[50003]:no audio device");
                    console.log(b)
                }) : navigator.getUserMedia({
                    audio: !0
                }, this.gotStream.bind(this), function(b) {
                    a.params.onError("50003", "no audio device");
                    console.error("[50003]:no audio device")
                })
            };
            this.record = function(d) {
                var e = Math.floor((new Date).getTime());
                a = -1 == b.sigTimeOut ? 0 : a;
                if (!this.params.sig || !this.params.timestamp || e - parseInt(this.params.timestamp) >= 1E3 * a) {
                    if (this.params.hasOwnProperty("signature"))
                        if ("function" == typeof this.params.signature)
                            e = this.params.signature();
                        else {
                            console.error("signature is not a function");
                            if ("function" == typeof c.params.onError)
                                c.params.onError(-1, "signature is not a function");
                            return
                        }
                    else
                        e = this.getSig(d);
                    if (!e || !e.sig || !e.timestamp) {
                        if ("function" == typeof c.params.onError)
                            c.params.onError(-1, "get signature fail");
                        console.error("get sig fail");
                        return
                    }
                    e.alg && -1 < ["sha1", "md5", "sha256"].indexOf(e.alg) && (this.params.alg = e.alg);
                    this.params.sig = e.sig;
                    d.sig = e.sig;
                    this.params.timestamp = e.timestamp;
                    d.timestamp = e.timestamp
                } else
                    d.sig = this.params.sig,
                    d.timestamp = this.params.timestamp;
                "undefined" !== typeof d.onRecordIdGenerated && (c.params.onRecordIdGenerated = d.onRecordIdGenerated);
                "undefined" !== typeof d.onStart && (c.params.onStart = d.onStart);
                "undefined" !== typeof d.onStop && (c.params.onStop = d.onStop);
                "undefined" !== typeof d.onInternalScore && (c.params.onInternalScore = d.onInternalScore);
                e = d.serverParams;
                e.sig = d.sig;
                e.timestamp = d.timestamp;
                e.duration = d.duration;
                e.playNotifyAudio = "undefined" == typeof d.playNotifyAudio ? !0 : d.playNotifyAudio;
                c.params.originalResult = "boolean" == typeof d.originalResult ? d.originalResult : !1;
                this.engine.startRecord(e)
            }
            ;
            this.stop = function() {
                c.engine.stopRecord(!0);
                c.__durationTimer && (clearTimeout(c.__durationTimer),
                c.__durationTimer = null)
            }
            ;
            this.startReplay = function(a) {
                "undefined" !== typeof a.onStop && (c.__onStopReplay = a.onStop);
                this.engine.startReplay()
            }
            ;
            this.stopReplay = function() {
                this.engine.stopReplay()
            }
            ;
            this.reset = function() {
                this.engine.stopReplay();
                this.engine.audioRecorder.isRecording() && this.engine.audioRecorder.stopRecord();
                this._onscore_time_out && (clearTimeout(c._onscore_time_out),
                c._onscore_time_out = null);
                c.__durationTimer && (clearTimeout(c.__durationTimer),
                c.__durationTimer = null)
            }
            ;
            var q = 0
              , n = null
              , m = function() {
                if (null != n)
                    if (c.dictResults.hasOwnProperty(n.recordId) ? (n.success(c.dictResults),
                    delete n.recordId,
                    q = 0,
                    n = null) : c.dictResults.hasOwnProperty("jsonFlag") && !c.dictResults.hasOwnProperty(n.recordId) && (n.success(c.dictResults),
                    q = 0,
                    n = null),
                    c.dictResults.hasOwnProperty("error"))
                        n.success(c.dictResults.error),
                        c.dictResults = {},
                        delete n.recordId,
                        q = 0,
                        n = null;
                    else if (q++,
                    q > Math.round(c.params.coreTimeout / 100)) {
                        var a = {};
                        a[n.recordId] = {
                            errId: "50201",
                            error: {
                                errMsg: "JSSDK getScore timeout"
                            }
                        };
                        n.success(a);
                        q = 0;
                        n = null
                    } else
                        this._onscore_time_out = setTimeout(m, 100)
            };
            this.getScores = function(a) {
                n = a;
                m()
            }
            ;
            this.getMicVolume = function() {
                if (this.getInputPoint)
                    var a = this.getInputPoint.gain.value;
                else
                    a = null,
                    console.debug("['getMicVolume']:AudioContext or gain  is null");
                return a
            }
            ;
            this.setMicVolume = function(a) {
                0 > a ? a = 0 : 1 < a && (a = 1);
                this.getInputPoint ? this.getInputPoint.gain.value = a : console.debug("['setMicVolume']:AudioContext or gain  is null")
            }
            ;
            this.setVolume = function(a) {
                0 > a ? a = 0 : 1 < a && (a = 1);
                c.audio ? c.audio.volume = a : console.debug("['setVolume']:audio is null")
            }
            ;
            this.getVolume = function() {
                if (c.audio)
                    var a = c.audio.volume;
                else
                    a = null,
                    console.debug("['getVolume']:AudioContext or gain  is null");
                return a
            }
            ;
            var p = !1;
            this.showVolumeBar = function(a, b) {
                function d(a, b) {
                    c.vAudioCtx = h = new (window.AudioContext || window.webkitAudioContext);
                    f = h.createMediaStreamSource(a);
                    g = h.createAnalyser();
                    g.fftSize = 2048;
                    f.connect(g);
                    b.strokeStyle = "#6CA6CD";
                    e(b)
                }
                function e(a) {
                    a.clearRect(0, 0, m, n);
                    a.beginPath();
                    a.moveTo(.5, Math.floor(.9 * n) + .5);
                    a.lineTo(m - .5, Math.floor(.9 * n) + .5);
                    a.closePath();
                    a.lineWidth = 1;
                    a.strokeStyle = "rgba(255, 0, 0, 0.5)";
                    a.stroke();
                    a.strokeStyle = "#6CA6CD";
                    var b = new Uint8Array(g.frequencyBinCount);
                    g.getByteFrequencyData(b);
                    for (var c = 0; c < g.frequencyBinCount; c += g.frequencyBinCount / 3)
                        t.length >= r && t.shift(),
                        t.push(b[c]);
                    a.beginPath();
                    for (b = 0; b < r; b++)
                        c = 1.2 * t[b],
                        a.moveTo(1 * b, n),
                        a.lineTo(1 * b, n - n * c / 256),
                        a.stroke();
                    setTimeout(function() {
                        e(a)
                    }, 150)
                }
                if (!p) {
                    p = !0;
                    var f, g, h;
                    a = c.volumeBar;
                    a.width = 0 < l.width ? l.width : 170;
                    a.height = 0 < l.height ? l.height : 50;
                    var k = a.getContext("2d")
                      , m = a.width
                      , n = a.height
                      , r = m / 1
                      , t = [];
                    a.border = 1;
                    a.style.backgroundColor = "#CBCBCB";
                    navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
                        audio: !0
                    }).then(function(a) {
                        d(a, k)
                    }).catch(function(a) {
                        console.log(a)
                    }) : navigator.getMedia({
                        audio: !0
                    }, function(a) {
                        d(a, k)
                    }, function() {})
                }
            }
            ;
            (function() {
                if (c.params.hasOwnProperty("onConnectorStatusChange") && "function" == typeof c.params.onConnectorStatusChange)
                    c.params.onConnectorStatusChange(50109, 0);
                try {
                    var a = new WebSocket(c.params.server + "/en.sent.score")
                } catch (r) {
                    if (c.params.hasOwnProperty("onConnectorStatusChange") && "function" == typeof c.params.onConnectorStatusChange)
                        c.params.onConnectorStatusChange(50101, 0);
                    console.error("[ testWebSocket ]connect failed to: " + c.params.server);
                    return
                }
                a.onopen = function(b) {
                    if (c.params.hasOwnProperty("onConnectorStatusChange") && "function" == typeof c.params.onConnectorStatusChange)
                        c.params.onConnectorStatusChange(50100, 0);
                    a.close();
                    a = null
                }
                ;
                a.onerror = function(b) {
                    if (c.params.hasOwnProperty("onConnectorStatusChange") && "function" == typeof c.params.onConnectorStatusChange)
                        c.params.onConnectorStatusChange(50101, 0);
                    console.error("[ testWebSocket ]connect failed to: " + c.params.server);
                    a = null
                }
                ;
                a.onclose = function() {}
            }
            )();
            this.log = function(a, b, d, e) {
                a = "https://log.cloud.chivox.com/bus?eid=" + a + "&est=" + b + "&applicationId=" + c.params.appKey + "&uid=" + c.params.userId;
                d = {
                    body: {
                        conn_url: encodeURIComponent(d),
                        reason: e,
                        user_agent: navigator.userAgent,
                        prot: 1
                    }
                };
                e = new XMLHttpRequest;
                e.open("POST", a, !0);
                e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                e.send("log=" + JSON.stringify(d))
            }
            ;
            this.getSig = function(a) {
                if ("" == this.params.sigurl)
                    return console.debug("[sigurl]:sigurl not set!"),
                    c.params.onError(-1, "sigurl not set!"),
                    !1;
                var b = this
                  , d = null;
                ai$.ajaxSettings.async = !1;
                ai$.getJSON(b.params.sigurl, {
                    alg: b.params.alg
                }, function(a) {
                    b.params.timestamp = a.timestamp;
                    b.params.sig = a.sig;
                    d = a
                });
                ai$.ajaxSettings.async = !0;
                return d
            }
        }
    };
    return function(a) {
        if (!a.hasOwnProperty("signature") || "3" != a.mode)
            if (!a.sigurl || "string" != typeof a.sigurl || 0 >= a.sigurl.length) {
                if ("undefined" !== typeof a.onError)
                    a.onError("sigurl\u53c2\u6570\u8bbe\u7f6e\u4e0d\u5bf9\u3002\u5f53\u524dsigurl\uff1a" + a.sigurl);
                console.error("sigurl\u53c2\u6570\u8bbe\u7f6e\u4e0d\u5bf9\u3002\u5f53\u524dsigurl\uff1a" + a.sigurl);
                return null
            }
        switch (a.mode) {
        case chivox.MODE.HTML5:
            var c = new b(a);
            break;
        case chivox.MODE.FLASH_FIRST:
            if ("undefined" === typeof a.initFlashTimeout) {
                if ("undefined" !== typeof a.onError)
                    a.onError("FLASH_FIRST\u6a21\u5f0f\u5fc5\u987b\u8981\u914d\u7f6einitFlashTimeout\u51fd\u6570");
                else
                    console.error("FLASH_FIRST\u6a21\u5f0f\u5fc5\u987b\u8981\u914d\u7f6einitFlashTimeout\u51fd\u6570");
                return null
            }
            var f = a.initFlashTimeout
              , d = f.timeout;
            c = new chivox.AiRecorderAs(a);
            setTimeout(function() {
                c.loaded || (ai$("#" + a.id).remove(),
                c = new b(a),
                c.mode = chivox.MODE.HTML5,
                f.h5recorderInitialized(c))
            }, d);
            break;
        default:
            c = new chivox.AiRecorderAs(a)
        }
        c.mode = a.mode;
        return c
    }
}();
chivox.AiStatusCode = {
    "default": {
        id: "",
        description: "\u672a\u77e5\u9519\u8bef\u3002",
        feedback: {
            en: "Please try again.",
            cn: "\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    default2: {
        id: "default",
        description: "",
        feedback: {
            en: "Speech server error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    default4: {
        id: "default",
        description: "",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    default5: {
        id: "default",
        state: "",
        description: "",
        feedback: {
            en: "Unknown flash error.",
            cn: "\u672a\u77e5\u7684Flash\u9519\u8bef\u3002"
        }
    },
    default6: {
        id: "default",
        description: "",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u5185\u6838\u51fa\u73b0\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    "-1": {
        id: "-1",
        description: "sigurl\u6ca1\u6709\u8bbe\u7f6e",
        feedback: {
            en: "sigurl not set!",
            cn: "sigurl\u6ca1\u6709\u8bbe\u7f6e\u3002"
        }
    },
    2: {
        id: "2",
        description: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    5: {
        id: "5",
        description: "\u8bc4\u5206\u6587\u672c\u4e0d\u6b63\u786e",
        feedback: {
            en: "Incorrect refText.",
            cn: "\u8bc4\u5206\u6587\u672c\u4e0d\u6b63\u786e\u3002"
        }
    },
    6: {
        id: "6",
        description: "refText\u6587\u672c\u4e0d\u6ee1\u8db3ebnf\u6587\u6cd5",
        feedback: {
            en: "The refText text does not meet the ebnf grammar.",
            cn: "refText\u6587\u672c\u4e0d\u6ee1\u8db3ebnf\u6587\u6cd5\u3002"
        }
    },
    400: {
        id: "400",
        description: "Audio Decode Error, \u97f3\u9891\u89e3\u7801\u9519\u8bef",
        feedback: {
            en: "Audio decode error, please try again.",
            cn: "\u97f3\u9891\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    407: {
        id: "407",
        description: "RPC_param error",
        feedback: {
            en: "RPC parameter error.",
            cn: "RPC\u53c2\u6570\u4e0d\u6b63\u786e"
        }
    },
    503: {
        id: "503",
        description: "RPC timeout",
        feedback: {
            en: "RPC request timeout.",
            cn: "RPC\u8bf7\u6c42\u8d85\u65f6"
        }
    },
    5501: {
        id: "5501",
        description: "\u5185\u6838\u8df3\u8f6c\u5185\u90e8\u7684\u53c2\u6570\u4e0d\u7b26\u5408\u89c4\u5219",
        feedback: {
            en: "Contact us.",
            cn: "\u8054\u7cfb\u6280\u672f\u652f\u6301\u3002"
        }
    },
    6001: {
        id: "6001",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    6002: {
        id: "6002",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    6003: {
        id: "6002",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    20001: {
        id: "20001",
        description: "VAD\u6a21\u5757\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\u7aef\u70b9",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20002: {
        id: "20002",
        description: "\u8f93\u5165VAD\u6a21\u5757\u7684Package\u6570\u636e\u4e3a\u7a7a",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20101: {
        id: "20101",
        description: "\u63d0\u53d6\u7684\u6240\u6709F0\u7279\u5f81\u5747\u4e3a0",
        feedback: {
            en: "Speech server detected no speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20102: {
        id: "20102",
        description: "\u7ecf\u8fc7\u7279\u5f81\u540e\u5904\u7406\uff0c\u6ca1\u6709\u5f97\u5230voiced\u6bb5",
        feedback: {
            en: "Speech server detected no speech, please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20300: {
        id: "20300",
        description: "\u8bc6\u522b\u6a21\u5757\u4e00\u822c\u6027\u9519\u8bef",
        feedback: {
            en: "Speech server detected incompleted speech, please try again.",
            cn: "\u53d1\u97f3\u4e0d\u5b8c\u6574\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20301: {
        id: "20301",
        description: "\u5355\u8bcd\u6ca1\u6709\u5305\u542b\u5728\u5b57\u5178\u4e2d\u3002\u9700\u8981\u5e94\u7528\u5f00\u53d1\u8005\u5904\u7406\uff0c\u5c06\u6b64\u7c7b\u5355\u8bcd\u53cd\u9988\u7ed9chivox\uff0c\u505a\u6dfb\u52a0\u5b57\u5178\u5904\u7406\u3002",
        feedback: {
            en: "Speech server cannot recognise the speech. Please contact us to report this.",
            cn: "\u5355\u8bcd\u6ca1\u6709\u5305\u542b\u5728\u5b57\u5178\u4e2d\uff0c\u8bf7\u68c0\u67e5\u53c2\u8003\u6587\u672c\u662f\u5426\u6b63\u786e\u3002\u5982\u679c\u4ecd\u6709\u95ee\u9898\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    20302: {
        id: "20302",
        description: "\u6ca1\u6709\u8bc6\u522b\u7ed3\u679c, no token suvived",
        feedback: {
            en: "Speech server cannot recognise the speech. Please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20303: {
        id: "20303",
        description: "\u5207\u5206\u6ca1\u6709\u7ed3\u679c, no token suvived",
        feedback: {
            en: "Speech server cannot recognise the speech. Please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20401: {
        id: "20401",
        description: "\u4fe1\u566a\u6bd4\u8fc7\u4f4e",
        feedback: {
            en: "Speech is too weak to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u4f4e\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20402: {
        id: "20402",
        description: "\u8bed\u97f3\u80fd\u91cf\u8fc7\u4f4e",
        feedback: {
            en: "Speech is too weak to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u4f4e\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20403: {
        id: "20403",
        description: "\u8bed\u97f3\u80fd\u91cf\u8fc7\u9ad8",
        feedback: {
            en: "Speech is too laud to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u9ad8\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20404: {
        id: "20404",
        description: "\u51fa\u73b0\u622a\u5e45\u73b0\u8c61",
        feedback: {
            en: "Speech is too laud to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u9ad8\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40001: {
        id: "40001",
        state: "\u672a\u6307\u5b9a\u8bf7\u6c42\u53c2\u6570",
        description: "\u672a\u6307\u5b9a\u8bf7\u6c42\u53c2\u6570",
        feedback: {
            en: "",
            cn: "\u672a\u6307\u5b9a\u8bf7\u6c42\u53c2\u6570"
        }
    },
    40002: {
        id: "40002",
        state: "\u672a\u5728\u53c2\u6570\u4e2d\u6dfb\u52a0request\u53c2\u6570\u9879",
        description: "\u672a\u5728\u53c2\u6570\u4e2d\u6dfb\u52a0request\u53c2\u6570\u9879",
        feedback: {
            en: "",
            cn: "\u672a\u5728\u53c2\u6570\u4e2d\u6dfb\u52a0request\u53c2\u6570\u9879"
        }
    },
    40400: {
        id: "40400",
        state: "\u8bf7\u6c42\u7684\u5185\u6838\u8d44\u6e90\u4e0d\u5b58\u5728",
        description: "\u8bf7\u6c42\u7684\u5185\u6838\u8d44\u6e90\u4e0d\u5b58\u5728",
        feedback: {
            en: "",
            cn: "\u8bf7\u6c42\u7684\u5185\u6838\u8d44\u6e90\u4e0d\u5b58\u5728"
        }
    },
    40092: {
        id: "40092",
        state: "\u4f20\u8f93\u7684\u97f3\u9891\u65f6\u957f\u8d85\u9650",
        description: "\u4f20\u8f93\u7684\u97f3\u9891\u65f6\u957f\u8d85\u9650",
        feedback: {
            en: "",
            cn: "\u4f20\u8f93\u7684\u97f3\u9891\u65f6\u957f\u8d85\u9650"
        }
    },
    41001: {
        id: "41001",
        state: "\u53c2\u6570\u975eJSON\u683c\u5f0f",
        description: "\u53c2\u6570\u975eJSON\u683c\u5f0f",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u975eJSON\u683c\u5f0f"
        }
    },
    41002: {
        id: "41002",
        state: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709cmd\u9879",
        description: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709cmd\u9879",
        feedback: {
            en: "",
            cn: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709cmd\u9879"
        }
    },
    41004: {
        id: "41004",
        state: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709param\u9879",
        description: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709param\u9879",
        feedback: {
            en: "",
            cn: "\u63a7\u5236\u6d88\u606f\u7684\u683c\u5f0f\u51fa\u9519\u6ca1\u6709param\u9879"
        }
    },
    41007: {
        id: "41007",
        state: "\u672a\u4f20\u8f93\u97f3\u9891\u683c\u5f0f",
        description: "\u672a\u4f20\u8f93\u97f3\u9891\u683c\u5f0f",
        feedback: {
            en: "",
            cn: "\u672a\u4f20\u8f93\u97f3\u9891\u683c\u5f0f"
        }
    },
    41008: {
        id: "41008",
        state: "\u97f3\u9891\u683c\u5f0f\u4e0d\u652f\u6301",
        description: "\u97f3\u9891\u683c\u5f0f\u4e0d\u652f\u6301",
        feedback: {
            en: "",
            cn: "\u97f3\u9891\u683c\u5f0f\u4e0d\u652f\u6301"
        }
    },
    41009: {
        id: "41009",
        state: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        description: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5"
        }
    },
    41010: {
        id: "41010",
        state: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        description: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5"
        }
    },
    41011: {
        id: "41011",
        state: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        description: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u97f3\u9891\u4fe1\u606f\u4e0d\u5408\u6cd5"
        }
    },
    41012: {
        id: "41012",
        state: "\u672a\u4f20\u8f93\u97f3\u9891\u4fe1\u606f",
        description: "\u672a\u4f20\u8f93\u97f3\u9891\u4fe1\u606f",
        feedback: {
            en: "",
            cn: "\u672a\u4f20\u8f93\u97f3\u9891\u4fe1\u606f"
        }
    },
    41014: {
        id: "41014",
        state: "request\u4e2d\u7684\u4fe1\u606f\u4e0d\u5408\u6cd5",
        description: "request\u4e2d\u7684\u4fe1\u606f\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "request\u4e2d\u7684\u4fe1\u606f\u4e0d\u5408\u6cd5"
        }
    },
    41015: {
        id: "41015",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41016: {
        id: "41016",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41017: {
        id: "41017",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41018: {
        id: "41018",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41019: {
        id: "41019",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41020: {
        id: "41020",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41021: {
        id: "41021",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41022: {
        id: "41022",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41023: {
        id: "41023",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41024: {
        id: "41024",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41025: {
        id: "41025",
        state: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        description: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5",
        feedback: {
            en: "",
            cn: "\u53c2\u6570\u4e2d\u6709\u9057\u6f0f\u6216\u4e0d\u5408\u6cd5"
        }
    },
    41030: {
        id: "41030",
        state: "auth\u9a8c\u8bc1\u672a\u901a\u8fc7",
        description: "auth\u9a8c\u8bc1\u672a\u901a\u8fc7",
        feedback: {
            en: "",
            cn: "auth\u9a8c\u8bc1\u672a\u901a\u8fc7"
        }
    },
    41031: {
        id: "41031",
        state: "auth\u9a8c\u8bc1\u5f02\u5e38",
        description: "auth\u9a8c\u8bc1\u5f02\u5e38",
        feedback: {
            en: "",
            cn: "auth\u9a8c\u8bc1\u5f02\u5e38"
        }
    },
    41032: {
        id: "41032",
        state: "auth\u9a8c\u8bc1\u5f02\u5e38",
        description: "auth\u9a8c\u8bc1\u5f02\u5e38",
        feedback: {
            en: "",
            cn: "auth\u9a8c\u8bc1\u5f02\u5e38"
        }
    },
    42003: {
        id: "42003",
        state: "\u5ba2\u6237\u7aef\u53d1\u9001\u8bf7\u6c42\u7684\u987a\u5e8f\u51fa\u9519",
        description: "\u5ba2\u6237\u7aef\u53d1\u9001\u8bf7\u6c42\u7684\u987a\u5e8f\u51fa\u9519",
        feedback: {
            en: "",
            cn: "\u5ba2\u6237\u7aef\u53d1\u9001\u8bf7\u6c42\u7684\u987a\u5e8f\u51fa\u9519"
        }
    },
    0: {
        id: "",
        state: "",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    51E3: {
        id: "51000",
        state: "\u521d\u59cb\u5316\u5185\u6838\u51fa\u9519",
        description: "\u521d\u59cb\u5316\u5185\u6838\u51fa\u9519",
        feedback: {
            en: "",
            cn: "\u521d\u59cb\u5316\u5185\u6838\u51fa\u9519"
        }
    },
    51001: {
        id: "51001",
        state: "feed\u97f3\u9891\u7ed9\u5185\u6838\u65f6\u51fa\u9519",
        description: "feed\u97f3\u9891\u7ed9\u5185\u6838\u65f6\u51fa\u9519",
        feedback: {
            en: "",
            cn: "feed\u97f3\u9891\u7ed9\u5185\u6838\u65f6\u51fa\u9519"
        }
    },
    51002: {
        id: "51002",
        state: "\u751f\u6210\u5185\u6838\u7ed3\u679c\u65f6\u51fa\u9519",
        description: "\u751f\u6210\u5185\u6838\u7ed3\u679c\u65f6\u51fa\u9519",
        feedback: {
            en: "",
            cn: "\u751f\u6210\u5185\u6838\u7ed3\u679c\u65f6\u51fa\u9519"
        }
    },
    52E3: {
        id: "52000",
        state: "\u96c6\u7fa4\u8fdb\u7a0b\u8d44\u6e90\u77ed\u7f3a",
        description: "\u96c6\u7fa4\u8fdb\u7a0b\u8d44\u6e90\u77ed\u7f3a",
        feedback: {
            en: "",
            cn: "\u96c6\u7fa4\u8fdb\u7a0b\u8d44\u6e90\u77ed\u7f3a"
        }
    },
    53E3: {
        id: "53000",
        state: "\u5185\u6838\u8fdb\u7a0b\u5d29\u6e83",
        description: "\u5185\u6838\u8fdb\u7a0b\u5d29\u6e83",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8fdb\u7a0b\u5d29\u6e83"
        }
    },
    55200: {
        id: "55200",
        state: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        description: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u7531\u4e8e\u670d\u52a1\u7aef\u7684\u914d\u7f6e\u5f02\u5e38\u5bfc\u81f4\u5185\u6838\u8df3\u8f6c\u5f02\u5e38",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u7531\u4e8e\u670d\u52a1\u7aef\u7684\u914d\u7f6e\u5f02\u5e38\u5bfc\u81f4\u5185\u6838\u8df3\u8f6c\u5f02\u5e38"
        }
    },
    55201: {
        id: "55201",
        state: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        description: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u672a\u77e5\u539f\u56e0\u5f15\u8d77\u7684\u5185\u6838\u8df3\u8f6c\u6d41\u6c34\u7ebf\u6df7\u4e71"
        }
    },
    55202: {
        id: "55202",
        state: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        description: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u53ef\u80fd\u5ba2\u6237\u7aef\u76f4\u63a5\u8bf7\u6c42\u865a\u62df\u5185\u6838\uff0c\u6216\u8005\u914d\u7f6e\u4e2d\u5c06\u865a\u62df\u5185\u6838\u52a0\u5165\u4e86\u4e2d\u95f4\u8df3\u8f6c\u6b65\u9aa4\u4e2d",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u53ef\u80fd\u5ba2\u6237\u7aef\u76f4\u63a5\u8bf7\u6c42\u865a\u62df\u5185\u6838\uff0c\u6216\u8005\u914d\u7f6e\u4e2d\u5c06\u865a\u62df\u5185\u6838\u52a0\u5165\u4e86\u4e2d\u95f4\u8df3\u8f6c\u6b65\u9aa4\u4e2d"
        }
    },
    55203: {
        id: "55203",
        state: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        description: "\u521d\u59cb\u5316\u5185\u90e8\u8fde\u63a5\u65f6\u51fa\u9519,\u5efa\u8bae\u91cd\u8bd5",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u521d\u59cb\u5316\u5185\u90e8\u8fde\u63a5\u65f6\u51fa\u9519,\u5efa\u8bae\u91cd\u8bd5"
        }
    },
    55204: {
        id: "55204",
        state: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519",
        description: "\u8df3\u8f6c\u65f6\u65e0\u6cd5\u8fde\u63a5\u81f3\u5185\u90e8\u670d\u52a1,\u5efa\u8bae\u91cd\u8bd5",
        feedback: {
            en: "",
            cn: "\u5185\u6838\u8df3\u8f6c\u51fa\u9519,\u8df3\u8f6c\u65f6\u65e0\u6cd5\u8fde\u63a5\u81f3\u5185\u90e8\u670d\u52a1,\u5efa\u8bae\u91cd\u8bd5"
        }
    },
    70001: {
        id: "70001",
        state: "SDK\u7248\u672c\u9700\u8981\u5347\u7ea7",
        description: "SDK\u7248\u672c\u9700\u8981\u5347\u7ea7",
        feedback: {
            en: "",
            cn: "SDK\u7248\u672c\u9700\u8981\u5347\u7ea7"
        }
    },
    5E4: {
        id: "50000",
        state: "FLASH_LOAD_COMPLETE",
        description: "\u5f53\u52a0\u8f7dflash \u5b8c\u6210\u65f6\uff08\u8fd9\u91cc\u8bf4\u7684\u5b8c\u6210\uff0c\u6307\u7684\u662f\u81ea\u5df1\u5df2\u7ecf\u5b8c\u6210\u4e86\u521d\u59cb\u5316\uff0c\u5e76\u4e14\u548cJS \u63e1\u624b\u6210\u529f\u540e\uff09\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Flash load success.",
            cn: "Flash\u52a0\u8f7d\u6210\u529f\u3002"
        }
    },
    50001: {
        id: "50001",
        state: "MIC_UNMUTED",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570 \uff0c \u5982\u679c\u68c0\u6d4b\u7ed3\u679c\u662f\u5141\u8bb8\uff0c\u90a3\u4e48\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff1b \u5982\u679c\u4ece\u7981\u7528\u72b6\u6001\u4e0b\uff0c \u7528\u6237\u901a\u8fc7\u8bbe\u7f6e\uff0c\u624b\u52a8\u5141\u8bb8\u4e86mic\uff0c\u4e5f\u4f1a\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Microphone is allowed.",
            cn: "Flash\u53ef\u4ee5\u8bbf\u95ee\u9ea6\u514b\u98ce\u3002"
        }
    },
    50002: {
        id: "50002",
        state: "MIC_MUTED",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570\uff0c\u5982\u679c\u68c0\u6d4b\u7ed3\u679c\u662f \u4e0d\u5141\u8bb8\uff0c\u90a3\u4e48\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff1b\u5982\u679c\u4ece\u5141\u8bb8\u72b6\u6001\u4e0b\uff0c \u7528\u6237\u901a\u8fc7\u8bbe\u7f6e\uff0c\u624b\u52a8\u7981\u7528\u4e86mic\uff0c\u4e5f\u4f1a\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Microphone is not allowed, please check for Flash Player's Setting panel.",
            cn: "Flash\u4e0d\u80fd\u8bbf\u95ee\u9ea6\u514b\u98ce\uff0c\u8bf7\u68c0\u67e5\u8bbe\u7f6e\u3002"
        }
    },
    50003: {
        id: "50003",
        state: "MIC_NOT_FOUND",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570\uff0c \u5982\u679c\u68c0\u6d4b\u4e0d\u5230mic\uff0c\u90a3\u4e48\u56de\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Found no Microphone device, please check for it.",
            cn: "\u6ca1\u6709\u627e\u5230\u9ea6\u514b\u98ce\u8bbe\u5907\uff0c\u8bf7\u68c0\u67e5\u3002"
        }
    },
    50004: {
        id: "50004",
        state: "FUNCTION_EXECUTE_SUCCESSFUL",
        description: "\u5f53\u8c03\u7528\u51fd\u6570\u65f6\uff0c\u4f20\u53c2\u6b63\u786e\u65f6\uff0c\u76f4\u63a5\u51fd\u6570\u8fd4\u56de\u503c\u8fd4\u56de\u6b64\u6d88\u606f",
        feedback: {
            en: "Function is executed",
            cn: "\u51fd\u6570\u6267\u884c\u6210\u529f\u3002"
        }
    },
    50005: {
        id: "50005",
        state: "EXCEPTION_PARAMETER_ERROR",
        description: "\u5f53\u8c03\u7528\u51fd\u6570\u65f6\uff0c\u4f20\u53c2\u4e0d\u6b63\u786e\u65f6\uff0c\u8fd4\u56de\u6b64\u6d88\u606f",
        feedback: {
            en: "Parameters error, usually due to serverParam not provided.",
            cn: "\u53c2\u6570\u9519\u8bef\uff0c\u53ef\u80fd\u662f serverParam \u9519\u8bef\u3002"
        }
    },
    50006: {
        id: "50006",
        state: "EXCEPTION_RECORDERLIB_ERROR",
        description: "\u5f53\u8c03\u7528\u51fd\u6570\u65f6\uff0c\u4f20\u53c2\u4e0d\u6b63\u786e\u65f6\uff0c\u8fd4\u56de\u6b64\u6d88\u606f",
        feedback: {
            en: "RecorderLib instance not initialised.",
            cn: "\u5f55\u97f3\u673a\u672a\u521d\u59cb\u5316\u3002"
        }
    },
    50007: {
        id: "50007",
        state: "MMSCFG_INVALID",
        description: "\u68c0\u6d4b\u5230mms.cfg\u6587\u4ef6\u4e2d\u7684avHardwareDisable\u914d\u7f6e\u6709\u8bef\uff0c\u8bf7\u624b\u52a8\u4fee\u6539\u6216\u5220\u9664 mms.cfg\u6587\u4ef6",
        feedback: {
            en: "The mms.cfg file is not configured correctly, please delete it manually.",
            cn: "mms.cfg\u6587\u4ef6\u914d\u7f6e\u4e0d\u6b63\u786e\uff0c\u8bf7\u624b\u52a8\u5220\u9664\u3002"
        }
    },
    50008: {
        id: "50008",
        state: "MIC_PANEL_CLOSED",
        description: "\u5728flash\u5141\u8bb8\u72b6\u6001\u4e0b\uff0c\u7b2c\u4e00\u6b21\u70b9\u51fbflash\u9762\u677f\u4e0a\u7684\u5173\u95ed\u6309\u94ae\uff0c\u89e6\u53d1\u7684\u6b64\u4e8b\u4ef6",
        feedback: {
            en: "Click the close button on flash panel",
            cn: "\u70b9\u51fb\u4e86flash\u4e0a\u7684\u5173\u95ed\u6309\u94ae"
        }
    },
    50100: {
        id: "50100",
        state: "WS_CONNECT_SUCCESSFUL",
        description: "\u5f53\u8fde\u63a5\u4e0a\u6d41\u5a92\u4f53\u670d\u52a1\u5668\u65f6\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Successful to connect media server.",
            cn: "\u5f55\u97f3\u670d\u52a1\u5668\u8fde\u63a5\u6210\u529f\u3002"
        }
    },
    50103: {
        id: "50103",
        state: "WS_CONNECT_CLOSED",
        description: "\u5df2\u7ecf\u8fde\u4e0a\u670d\u52a1\u5668\uff0c\u4f46\u662f\u670d\u52a1\u5668\u7aef\u4e3b\u52a8\u65ad\u5f00\u4e86\u8fde\u63a5\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Connection to the media server is closed.",
            cn: "\u5f55\u97f3\u670d\u52a1\u5668\u65ad\u5f00\u4e86\u8fde\u63a5\u3002"
        }
    },
    50107: {
        id: "50107",
        state: "AUTH_FAILED",
        description: "",
        feedback: {
            en: "AUTH_FAILED.",
            cn: "\u6388\u6743\u5931\u8d25\u3002"
        }
    },
    50012: {
        id: "50012",
        state: "NET_ALREADY_CONNECTED",
        description: "\u5f55\u97f3\u673a\u5728\u5c1d\u8bd5\u91cd\u65b0\u8fde\u63a5\u670d\u52a1\u5668\uff0c\u4f46\u662f\u5b9e\u9645\u5df2\u7ecf\u8fde\u63a5\u65f6\uff0c\u65f6\u8fd4\u56de\u7ed9js\u3002",
        feedback: {
            en: "Net is already connected.",
            cn: "\u7f51\u7edc\u5df2\u7ecf\u8fde\u63a5\u3002"
        }
    },
    50200: {
        id: "50200",
        state: "CORE_REQUEST_SUCCESS",
        description: "\u5f53\u5f55\u97f3\u7ed3\u675f\uff0c\u5f55\u97f3\u673a\u4ece\u670d\u52a1\u5668\u7aef\u53d6\u5f97\u5185\u6838\u53cd\u9988\u7ed3\u679c\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff0c\u5f55\u97f3\u7ed3\u679c\u5c06\u76f4\u63a5\u5b58\u653e\u5728\u56de\u8c03\u7684msg \u53c2\u6570\u4e2d\uff0c\u4e3ajson\u5bf9\u8c61\u683c\u5f0f",
        feedback: {
            en: "Core request success.",
            cn: "\u8bc4\u5206\u6210\u529f\u3002"
        }
    },
    50201: {
        id: "50201",
        state: "CORE_REQUEST_TIMEOUT",
        description: "\u5f53\u5f55\u97f3\u7ed3\u675f\u540e\uff0c\u5728\u8bbe\u5b9a\u7684\u65f6\u95f4\u5185\uff0c\u670d\u52a1\u5668\u6ca1\u6709\u7ed9\u53cd\u9988\uff0c\u5219\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff0cflash \u5f55\u97f3\u673a\u5c06\u4e0d\u4f1a\u518d\u5bf9\u8fd9\u6b21\u5f55\u97f3\u6709\u4efb\u4f55\u53cd\u9988",
        feedback: {
            en: "Request to contact the speech server is time out.",
            cn: "\u8bc4\u5206\u8d85\u65f6\u3002"
        }
    },
    50202: {
        id: "50202",
        state: "SERVER_PARAMS_ERROR",
        description: "\u5f55\u97f3\u673a\u5411\u670d\u52a1\u5668\u53d1\u9001\u7684\u6570\u636e\u4e0d\u5b8c\u6574",
        feedback: {
            en: "Get score failed, please try again.",
            cn: "\u8bc4\u5206\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    50300: {
        id: "50300",
        state: "RECORD_STOP",
        description: '\u5f53\u5f55\u97f3\u7ed3\u675f\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\u5b50\u72b6\u6001 stopType, "0"\u8868\u793a \u81ea\u52a8\u505c\u6b62\u7684 \uff0c "1"\u8868\u793a \u624b\u52a8\u505c\u6b62\u7684',
        feedback: {
            en: "Recording stopped.",
            cn: "\u5f55\u97f3\u505c\u6b62\u3002"
        }
    },
    50301: {
        id: "50301",
        state: "RECORD_START",
        description: "\u5f53\u5f55\u97f3\u771f\u6b63\u5f00\u59cb\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Recording started",
            cn: "\u5f55\u97f3\u5f00\u59cb\u3002"
        }
    },
    50302: {
        id: "50302",
        state: "REPLAY_STOP",
        description: "\u56de\u653e\u7ed3\u675f",
        feedback: {
            en: "Replaying stopped.",
            cn: "\u56de\u653e\u505c\u6b62"
        }
    },
    50303: {
        id: "50303",
        state: "REPLAY_START",
        description: "\u56de\u653e\u5f00\u59cb",
        feedback: {
            en: "Replaying start.",
            cn: "\u56de\u653e\u5f00\u59cb\u3002"
        }
    },
    50304: {
        id: "50304",
        state: "TOKENID_GETTED",
        description: "\u5f53\u5728\u5f00\u59cb\u5f55\u97f3\u524d\uff0c\u83b7\u5f97\u5f55\u97f3tokenId \u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "TokenId generated.",
            cn: "\u83b7\u5f97\u5f55\u97f3ID\u6210\u529f\u3002"
        }
    },
    50306: {
        id: "50306",
        state: "RECORD_MICROPHONE_GAN_CHANGED",
        description: "\u5728\u9ea6\u514b\u98ce\u97f3\u91cf\u53d1\u751f\u6539\u53d8\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Microphone gan changed.",
            cn: "\u9ea6\u514b\u98ce\u97f3\u91cf\u53d1\u751f\u4e86\u6539\u53d8\u3002"
        }
    },
    50353: {
        id: "50353",
        state: "ERROR_RECORDER_STATUS_ERROR",
        description: '\u5f55\u97f3\u673a\u5728\u8c03\u7528\u51fd\u6570\u65f6\u7684\u72b6\u6001\u9519\u8bef\uff0c\u5b50\u72b6\u6001\u6709\uff1a<br>CANNOT_BE_RECORDING = "status.invalid:recording"<br>CANNOT_BE_IDLE = "status.invalid:idle"<br>CANNOT_BE_REPLAYING = "status.invalid:replaying"<br>CANNOT_BE_NOT_READY = "status.invalid:not_ready"<br>CANNOT_BE_INIT = "status.invalid:init"',
        feedback: {
            en: "Recorder status error.",
            cn: "\u8c03\u7528\u51fd\u6570\u524d\uff0c\u5f55\u97f3\u673a\u72b6\u6001\u4e0d\u6b63\u786e\u3002"
        }
    },
    50354: {
        id: "50354",
        state: "ERROR_RECORDER_STATUS_ERROR",
        description: "\u672a\u627e\u5230\u8be5tokenId\u7684\u672c\u5730\u97f3\u9891\uff1a<br>",
        feedback: {
            en: "Recorder status error.",
            cn: "\u672a\u627e\u5230\u8be5tokenId\u7684\u672c\u5730\u97f3\u9891\u3002"
        }
    },
    50355: {
        id: "50355",
        state: "EXCEPTION_NO_RECORD",
        description: "\u5728\u4f7f\u7528\u5f55\u97f3\u673a\u5c1d\u8bd5\u56de\u653e\uff0c\u4f46\u662f\u6ca1\u6709\u627e\u5230\u4efb\u4f55\u97f3\u9891\u65f6\u8fd4\u56de\u3002",
        feedback: {
            en: "No local cached record, usually due to not making a record.",
            cn: "\u65e0\u56de\u653e\u7f13\u5b58\u6587\u4ef6\u3002\u53ef\u80fd\u4ece\u672a\u5f55\u97f3\u8fc7\u3002"
        }
    },
    50400: {
        id: "50400",
        state: "PLAYER_AUDIO_LOAD_COMPLETED",
        description: "\u5728\u64ad\u653e\u524d\uff0c\u97f3\u9891\u52a0\u8f7d\u6210\u529f\u65f6\uff0c\u56de\u8c03\u6d88\u606f\u3002\u5982\u679c\u52a0\u8f7d\u65f6\u7684url\u4f7f\u7528\u7684\u662fhttp\u534f\u8bae\u5219\u8868\u793a\u52a0\u8f7dmp3\u5b8c\u6210\uff0c \u5982\u679c\u662frtmp\u534f\u8bae\u5219\u8868\u793a\u8fde\u63a5\u6d41\u5a92\u4f53\u670d\u52a1\u5668\u6210\u529f",
        feedback: {
            en: "Audio load success.",
            cn: "\u52a0\u8f7d\u97f3\u9891\u6210\u529f\u3002"
        }
    },
    50401: {
        id: "50401",
        state: "\u8c03\u7528startAudioPlay()\u540e\uff0c\u56de\u8c03\u6d88\u606f",
        description: "PLAY_START",
        feedback: {
            en: "Playing started.",
            cn: "\u64ad\u653e\u5f00\u59cb\u3002"
        }
    },
    50402: {
        id: "50402",
        state: "PLAY_STOP",
        description: '\u8c03\u7528stopAudioPlay()\u540e\uff0c\u6216\u97f3\u9891\u81ea\u52a8\u64ad\u653e\u505c\u6b62\u540e\uff0c \u56de\u8c03\u6d88\u606f\u3002\u5b50\u72b6\u6001\uff1a<br>stopType: "0"\u4ee3\u8868\u81ea\u52a8\u505c\u6b62\uff0c"1"\u4ee3\u8868\u624b\u52a8\u505c\u6b62',
        feedback: {
            en: "Playing stopped.",
            cn: "\u64ad\u653e\u505c\u6b62\u3002"
        }
    },
    50405: {
        id: "50405",
        state: "\u5728\u64ad\u653e\u4e2d\u8c03\u7528pauseAudioPlay()\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        description: "PLAY_PAUSE",
        feedback: {
            en: "Playing paused.",
            cn: "\u64ad\u653e\u6682\u505c\u3002"
        }
    },
    50406: {
        id: "50406",
        state: "PLAY_RESUME",
        description: "\u5728\u64ad\u653e\u4e2d\u8c03\u7528resumeAudioPlay()\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Playing resumed.",
            cn: "\u64ad\u653e\u6062\u590d\u3002"
        }
    },
    50409: {
        id: "50409",
        state: "PLAY_FILE_NOT_FOUND",
        description: "\u64ad\u653e\u65f6\uff0c\u6ca1\u6709\u627e\u5230\u6587\u4ef6\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Targeting audio file does not exist.",
            cn: "\u6ca1\u6709\u627e\u5230\u76ee\u6807\u6587\u4ef6\u3002"
        }
    },
    50410: {
        id: "50410",
        state: "PLAY_SERVER_ERROR",
        description: "\u64ad\u653e\u97f3\u9891\u65f6\uff0c\u670d\u52a1\u5668\u7aef\u51fa\u73b0\u9519\u8bef\u65f6\uff0c\u56de\u8c03\u6d88\u606f\uff0c\u4f46\u662f\u5e76\u4e0d\u662f\u6307\u64ad\u653e\u97f3\u9891\u5df2\u7ecf\u505c\u6b62\u4e86\uff0c\u800c\u662f\u8fd8\u5728\u7ee7\u7eed\uff0c\u5177\u4f53\u662f\u4ec0\u4e48\u9519\u8bef\uff0c \u9700\u8981\u67e5\u8be2\u670d\u52a1\u5668\u65e5\u5fd7",
        feedback: {
            en: "Play failed, please try again.",
            cn: "\u64ad\u653e\u51fa\u9519\u3002"
        }
    },
    50414: {
        id: "50414",
        state: "PLAYER_LOAD_START",
        description: "\u64ad\u653e\u5668\u5728\u5f00\u59cb\u8fde\u63a5\u670d\u52a1\u5668\u65f6\u56de\u8c03js\uff0c\u63a5\u53e3\u662fload\u65b9\u6cd5\u7684start\u56de\u8c03",
        feedback: {
            en: "Player load start.",
            cn: "\u64ad\u653e\u5668\u5f00\u59cb\u52a0\u8f7d\u97f3\u9891\u3002"
        }
    },
    50450: {
        id: "50450",
        state: "ERROR_STARTPLAY_PARAMETER_ERROR",
        description: "\u8c03\u7528startAudioPlay()\u65f6\uff0c\u53d1\u73b0\u64ad\u653e\u53c2\u6570\u9519\u8bef\uff0c\u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "StartPlay parameter error.",
            cn: "\u64ad\u653e\u53c2\u6570\u9519\u8bef"
        }
    },
    50451: {
        id: "50451",
        state: "ERROR_LOADAUDIO_PARAMETER_ERROR",
        description: "\u8c03\u7528loadAudioFromURL()\u65f6\uff0c\u53d1\u73b0load\u53c2\u6570\u9519\u8bef\uff0c\u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "LoadAudio parameter error.",
            cn: "\u52a0\u8f7d\u97f3\u9891\u53c2\u6570\u9519\u8bef"
        }
    },
    50452: {
        id: "50452",
        state: "ERROR_ADJUSTVOLUME_PARAMETER_ERROR",
        description: "\u8c03\u7528adjustVolume()\u65f6\uff0c\u53d1\u73b0\u6b64\u65b9\u6cd5\u7684\u53c2\u6570\u6709\u9519\u8bef\uff0c \u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "AdjustVolume parameter error.",
            cn: "\u8c03\u8282\u97f3\u91cf\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50453: {
        id: "50453",
        state: "ERROR_PLAYER_FLASHVARS_ERROR",
        description: "\u5f53\u5f00\u59cb\u4f20flashVars \u4e2d\u53c2\u6570\u6709\u9519\u8bef\u65f6\uff0c\u56de\u8c03\u6b64\u6d88\u606f",
        feedback: {
            en: "Flashvars parameter error.",
            cn: "Flash\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50454: {
        id: "50454",
        state: "ERROR_PLAYER_STATUS_ERROR",
        description: '\u5f53\u8c03\u7528\u67d0\u51fd\u6570\u65f6\uff0c\u53d1\u73b0\u72b6\u6001\u9519\u8bef\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u3002\u5b50\u72b6\u6001\uff1a CANNOT_BE_IDLE = "status.invalid:idle"<br>CANNOT_BE_NOT_READY = "status.invalid:not_ready"<br>CANNOT_BE_INIT = "status.invalid:init"<br>CANNOT_BE_PLAYING = "status.invalid:playing"<br>CANNOT_BE_LOADING = "status.invalid:loading"<br>CANNOT_BE_PAUSE = "status.invalid:pause"<br>CANNOT_BE_BUFFERING = "status.invalid:buffering"<br>CANNOT_BE_LOADED = "status.invalid:loaded"s',
        feedback: {
            en: "Player status error.",
            cn: "\u8c03\u7528\u51fd\u6570\u524d\uff0c\u64ad\u653e\u5668\u72b6\u6001\u4e0d\u6b63\u786e\u3002"
        }
    },
    50500: {
        id: "50500",
        state: "DEPENDENCY_READY",
        description: "DEPENDENCY_READY",
        feedback: {
            en: "DEPENDENCY_READY",
            cn: "DEPENDENCY_READY\u3002"
        }
    },
    50501: {
        id: "50501",
        state: "EXCEPTION_FACTORY_TIMEOUT",
        description: "EXCEPTION_FACTORY_TIMEOUT",
        feedback: {
            en: "EXCEPTION_FACTORY_TIMEOUT",
            cn: "EXCEPTION_FACTORY_TIMEOUT\u3002"
        }
    }
};
chivox.AiStatusCode.get = function(a, b) {
    var c = {
        id: a,
        description: "\u672a\u77e5\u9519\u8bef\u3002",
        state: "",
        feedback: {
            en: "Please try again.",
            cn: "\u8bf7\u91cd\u8bd5\u3002"
        }
    };
    "NO_DATA" == a ? c = {
        id: a,
        state: "NO_DATA",
        description: "\u6307\u5b9a\u4e4b\u95f4\u5185\u83b7\u53d6\u5f55\u97f3ID\u5931\u8d25",
        feedback: {
            en: "Recording failed, please try again.",
            cn: "\u5f55\u97f3\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    } : "TIMEOUT" == a ? c = {
        id: a,
        state: "TIMEOUT",
        description: "\u6307\u5b9a\u4e4b\u95f4\u5185\u8bc4\u5206\u5931\u8d25",
        feedback: {
            en: "Core request timeout, please try again.",
            cn: "\u8bc4\u5206\u8d85\u65f6\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    } : "undefined" !== typeof chivox.AiStatusCode[a] ? (a = chivox.AiStatusCode[a],
    c.id = a.id,
    c.state = a.state || "",
    c.description = a.description,
    c.feedback = a.feedback) : (c.id = a,
    c.state = "\u9519\u8bef\u7801" + a,
    c.description = "\u9519\u8bef\u7801" + a,
    c.feedback = {
        en: "\u9519\u8bef\u7801" + a,
        cn: "\u9519\u8bef\u7801" + a
    });
    c.feedback = "cn" == b ? c.feedback && c.feedback.cn || c.feedback : c.feedback && c.feedback.en || c.feedback;
    c.id && c.feedback && (c.feedback = c.id + ": " + c.feedback);
    return c
}
;
chivox.AiStatusCode.trySet = function(a, b) {
    "undefined" === typeof chivox.AiStatusCode[a] && (chivox.AiStatusCode[a] = {
        id: "error",
        description: b,
        feedback: {
            en: b,
            cn: b
        }
    })
}
;
chivox.AiTone = {
    __getToneModulus: function(a) {
        var b = [[0, 0, .47, 0, 0], [0, .5, -1.37, -1, 0], [0, -1, 0, 2, 0]]
          , c = [];
        c[0] = a[0] * b[0][0] + a[1] * b[0][1] + a[2] * b[0][2] + a[3] * b[0][3] + a[4] * b[0][4];
        c[1] = a[0] * b[1][0] + a[1] * b[1][1] + a[2] * b[1][2] + a[3] * b[1][3] + a[4] * b[1][4];
        c[2] = a[0] * b[2][0] + a[1] * b[2][1] + a[2] * b[2][2] + a[3] * b[2][3] + a[4] * b[2][4];
        return c
    },
    getStandardCurve: function(a, b, c, e) {
        c = "number" === typeof c ? c : 0;
        var f = []
          , d = 4 / a;
        a = 1 * a / 4;
        var g = [0, 0, 0, 0, 0];
        6 > b && 1 < b && (g[b - 1] = 1);
        g = this.__getToneModulus(g);
        for (h = 0; 3 > h; h++)
            g[h] *= a;
        for (h = 0; 4 > h; h += d)
            tx = h * h * g[0] + h * g[1] + g[2] + c,
            f.push(tx);
        if ("undefined" != typeof e && 0 == e)
            if (1 == b)
                for (var h in f)
                    0 != f.hasOwnProperty(h) && (f[h] += 50);
            else if (2 == b)
                for (h in f)
                    0 != f.hasOwnProperty(h) && (f[h] += 25);
            else if (3 == b)
                for (h in f)
                    0 != f.hasOwnProperty(h) && (f[h] -= 25);
        return f
    },
    getUserCurve: function(a, b, c, e, f) {
        e = "number" === typeof e ? e : 0;
        var d = []
          , g = 4 / b;
        b = 1 * b / 4;
        if (null == a || 5 != a.length)
            return null;
        var h = .5 * a[1] + .25 * a[2] - .25 * a[3]
          , l = a[0] / 100;
        for (k = 1; k < a.length; k++)
            a[k - 1] = a[k] / 100;
        a[a.length - 1] = l;
        a = this.__getToneModulus(a);
        for (k = 0; 3 > k; k++)
            a[k] *= b;
        for (k = 0; 4 > k; k += g)
            d.push(k * k * a[0] + k * a[1] + a[2] + c + e);
        if ("undefined" != typeof f && 0 == f)
            for (var k in d)
                0 != d.hasOwnProperty(k) && (d[k] += h);
        return d
    }
};
chivox.CnSentRec = function(a) {
    this.data = a
}
;
chivox.CnSentRec.prototype.getParams = function() {
    return this.data.params
}
;
chivox.CnSentRec.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.CnSentRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.CnSentRec.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.CnSentRec.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.CnSentRec.prototype.getConf = function() {
    return this.data.result.conf
}
;
chivox.CnSentRec.prototype.getRec = function() {
    return this.data.result.rec
}
;
chivox.strtoutf8 = function(a) {
    var b = ""
      , c = 0;
    for (c1 = c2 = 0; c < a.length; ) {
        var e = a.charCodeAt(c);
        128 > e ? (b += String.fromCharCode(e),
        c++) : 191 < e && 224 > e ? (c2 = a.charCodeAt(c + 1),
        b += String.fromCharCode((e & 31) << 6 | c2 & 63),
        c += 2) : (c2 = a.charCodeAt(c + 1),
        c3 = a.charCodeAt(c + 2),
        b += String.fromCharCode((e & 15) << 12 | (c2 & 63) << 6 | c3 & 63),
        c += 3)
    }
    return b
}
;
chivox.CnAsrRec = function(a) {
    this.data = a
}
;
chivox.CnAsrRec.prototype.getParams = function() {
    return this.data.params
}
;
chivox.CnAsrRec.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.CnAsrRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.CnAsrRec.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.CnAsrRec.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.CnAsrRec.prototype.getRec = function() {
    return chivox.strtoutf8(this.data.result.rec)
}
;
chivox.CnSentScore = function(a) {
    this.data = a
}
;
chivox.CnSentScore.prototype.getParams = function() {
    return this.data.params
}
;
chivox.CnSentScore.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.CnSentScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.CnSentScore.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.CnSentScore.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.CnSentScore.prototype.getRank = function() {
    return this.data.result.rank
}
;
chivox.CnSentScore.prototype.getOverall = function() {
    return 100
}
;
chivox.CnSentScore.prototype.getPron = function() {
    return this.data.result.pron
}
;
chivox.CnSentScore.prototype.getPhn = function() {
    return this.data.result.phn
}
;
chivox.CnSentScore.prototype.getToneScore = function() {
    return this.data.result.tone
}
;
chivox.CnSentScore.prototype.getFluency = function() {
    return this.data.result.fluency.overall
}
;
chivox.CnSentScore.prototype.getCharSize = function() {
    return this.data.result.details.length
}
;
chivox.CnSentScore.prototype.getChar = function(a) {
    return new chivox.CnSentScore.Char(this.data.result.details[a])
}
;
chivox.CnSentScore.Char = function(a) {
    this.data = a
}
;
chivox.CnSentScore.Char.prototype.getConfidence = function() {
    return this.data.confidence
}
;
chivox.CnSentScore.Char.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.CnSentScore.Char.prototype.getTone = function() {
    return this.data.tone
}
;
chivox.CnSentScore.Char.prototype.getToneScore = function() {
    return this.data.tonescore
}
;
chivox.CnSentScore.Char.prototype.getPron = function() {
    return this.data.pron
}
;
chivox.CnSentScore.Char.prototype.getPhn = function() {
    return this.data.phn
}
;
chivox.CnSentScore.Char.prototype.getOverall = function() {
    return 100
}
;
chivox.CnSentScore.Char.prototype.getPhoneSize = function() {
    return this.data.phone ? this.data.phone.length : 0
}
;
chivox.CnSentScore.Char.prototype.getPhone = function(a) {
    return this.data.phone ? new chivox.CnSentScore.Char.Phone(this.data.phone[a]) : null
}
;
chivox.CnSentScore.Char.Phone = function(a) {
    this.data = a
}
;
chivox.CnSentScore.Char.Phone.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.CnSentScore.Char.Phone.prototype.getScore = function() {
    return this.data.score
}
;
chivox.CnWordScore = function(a) {
    this.data = a
}
;
chivox.CnWordScore.prototype.getParams = function() {
    return this.data.params
}
;
chivox.CnWordScore.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.CnWordScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.CnWordScore.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.CnWordScore.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.CnWordScore.prototype.getRank = function() {
    return this.data.result.rank
}
;
chivox.CnWordScore.prototype.getOverall = function() {
    return 100
}
;
chivox.CnWordScore.prototype.getPron = function() {
    return this.data.result.pron
}
;
chivox.CnWordScore.prototype.getPhn = function() {
    return this.data.result.phn
}
;
chivox.CnWordScore.prototype.getToneScore = function() {
    return this.data.result.tone
}
;
chivox.CnWordScore.prototype.getCharSize = function() {
    return this.data.result.details.length
}
;
chivox.CnWordScore.prototype.getChar = function(a) {
    return new chivox.CnWordScore.Char(this.data.result.details[a])
}
;
chivox.CnWordScore.Char = function(a) {
    this.data = a
}
;
chivox.CnWordScore.Char.prototype.getConfidence = function() {
    return this.data.confidence
}
;
chivox.CnWordScore.Char.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.CnWordScore.Char.prototype.getTone = function() {
    return this.data.tone
}
;
chivox.CnWordScore.Char.prototype.getToneScore = function() {
    return this.data.tonescore
}
;
chivox.CnWordScore.Char.prototype.getPron = function() {
    return this.data.pron
}
;
chivox.CnWordScore.Char.prototype.getPhn = function() {
    return this.data.phn
}
;
chivox.CnWordScore.Char.prototype.getOverall = function() {
    return 100
}
;
chivox.CnWordScore.Char.prototype.getPhoneSize = function() {
    return this.data.phone ? this.data.phone.length : 0
}
;
chivox.CnWordScore.Char.prototype.getPhone = function(a) {
    return this.data.phone ? new chivox.CnWordScore.Char.Phone(this.data.phone[a]) : null
}
;
chivox.CnWordScore.Char.Phone = function(a) {
    this.data = a
}
;
chivox.CnWordScore.Char.Phone.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.CnWordScore.Char.Phone.prototype.getScore = function() {
    return this.data.score
}
;
chivox.EnScoreMap = {
    ih: "\u026a",
    ax: "\u0259",
    oh: "\u0252",
    uh: "\u028a",
    ah: "\u028c",
    eh: "e",
    ae: "\u00e6",
    iy: "i:",
    er: "\u025c:",
    axr: "\u025a",
    ao: "\u0254:",
    uw: "u:",
    aa: "\u0251:",
    ey: "e\u026a",
    ay: "a\u026a",
    oy: "\u0254\u026a",
    aw: "a\u028a",
    ow: "\u04d9\u028a",
    ia: "\u026a\u0259",
    ea: "\u025b\u04d9",
    ua: "\u028a\u0259",
    p: "p",
    b: "b",
    t: "t",
    d: "d",
    k: "k",
    g: "g",
    l: "l",
    r: "r",
    m: "m",
    n: "n",
    ng: "\u014b",
    hh: "h",
    s: "s",
    z: "z",
    th: "\u03b8",
    dh: "\u00f0",
    f: "f",
    v: "v",
    w: "w",
    y: "j",
    sh: "\u0283",
    zh: "\u0292",
    ch: "t\u0283",
    jh: "d\u0292",
    get: function(a) {
        return "string" === typeof chivox.EnScoreMap[a] ? chivox.EnScoreMap[a] : a
    }
};
chivox.EnSentRec = function(a) {
    this.data = a
}
;
chivox.EnSentRec.prototype.getParams = function() {
    return this.data.params
}
;
chivox.EnSentRec.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.EnSentRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.EnSentRec.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.EnSentRec.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.EnSentRec.prototype.getConf = function() {
    return this.data.result.conf
}
;
chivox.EnSentRec.prototype.getRec = function() {
    return this.data.result.rec
}
;
chivox.EnSentScore = function(a) {
    this.data = a
}
;
chivox.EnSentScore.prototype.getParams = function() {
    return this.data.params
}
;
chivox.EnSentScore.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.EnSentScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.EnSentScore.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.EnSentScore.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.EnSentScore.prototype.getOverall = function() {
    return 100
}
;
chivox.EnSentScore.prototype.getPron = function() {
    return this.data.result.pron
}
;
chivox.EnSentScore.prototype.getFluency = function() {
    return this.data.result.fluency.overall
}
;
chivox.EnSentScore.prototype.getIntegrity = function() {
    return this.data.result.integrity
}
;
chivox.EnSentScore.prototype.getRhythm = function() {
    return this.data.result.rhythm.overall
}
;
chivox.EnSentScore.prototype.getAccuracy = function() {
    return this.data.result.accuracy
}
;
chivox.EnSentScore.prototype.getRank = function() {
    return this.data.result.rank
}
;
chivox.EnSentScore.prototype.getWordSize = function() {
    return "undefined" != typeof this.data.result.chars && 0 < this.data.result.chars.length ? this.data.result.chars.length : "undefined" != typeof this.data.result.details && 0 < this.data.result.details.length ? this.data.result.details.length : 0
}
;
chivox.EnSentScore.prototype.getWord = function(a) {
    if ("undefined" != typeof this.data.result.chars && 0 < this.data.result.chars.length) {
        for (var b = {
            "char": "",
            dur: 0,
            fluency: 0,
            score: 0,
            senseref: 0,
            sensescore: 0,
            stressref: 0,
            stressscore: 0,
            toneref: 0,
            tonescore: 0,
            liaison: 0
        }, c = 0, e = 0; e < a; e++)
            c += this.data.result.chars[e].normalize.length;
        a = this.data.result.chars[a];
        b["char"] = a["char"];
        for (e = 0; e < a.normalize.length; e++) {
            var f = this.data.result.details[c + e];
            b.dur += f.dur;
            b.fluency += f.fluency;
            b.score += f.score;
            b.senseref += f.senseref;
            b.sensescore += f.sensescore;
            b.stressref += f.stressref;
            b.stressscore += f.stressscore;
            b.toneref += f.toneref;
            b.tonescore += f.tonescore;
            b.liaison += f.liaison
        }
        b.fluency = Math.round(b.fluency / a.normalize.length);
        b.score = Math.round(b.score / a.normalize.length);
        b.sensescore = Math.round(b.sensescore / a.normalize.length);
        b.stressscore = Math.round(b.stressscore / a.normalize.length);
        b.tonescore = Math.round(b.tonescore / a.normalize.length)
    } else
        b = this.data.result.details[a];
    return new chivox.EnSentScore.Word(b)
}
;
chivox.EnSentScore.Word = function(a) {
    this.data = a
}
;
chivox.EnSentScore.Word.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.EnSentScore.Word.prototype.getDur = function() {
    return this.data.dur
}
;
chivox.EnSentScore.Word.prototype.getFluency = function() {
    return this.data.fluency
}
;
chivox.EnSentScore.Word.prototype.getScore = function() {
    return this.data.score
}
;
chivox.EnSentScore.Word.prototype.getStressRef = function() {
    return this.data.stressref
}
;
chivox.EnSentScore.Word.prototype.getStressScore = function() {
    return this.data.stressscore
}
;
chivox.EnSentScore.Word.prototype.getToneRef = function() {
    return this.data.toneref
}
;
chivox.EnSentScore.Word.prototype.getToneScore = function() {
    return this.data.tonescore
}
;
chivox.EnSentScore.Word.prototype.getLiaison = function() {
    return this.data.liaison
}
;
chivox.EnWordScore = function(a) {
    this.data = a
}
;
chivox.EnWordScore.prototype.getParams = function() {
    return this.data.params
}
;
chivox.EnWordScore.prototype.getRecordId = function() {
    return this.data.recordId
}
;
chivox.EnWordScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
}
;
chivox.EnWordScore.prototype.hasError = function() {
    var a = !1;
    if ("undefined" == typeof this.data.result || "undefined" != typeof this.data.result.err || "undefined" != typeof this.data.result.error || "undefined" != typeof this.data.result.errID)
        a = !0;
    return a
}
;
chivox.EnWordScore.prototype.getErrorCode = function() {
    if (this.hasError())
        return "undefined" != typeof this.data.result && "undefined" != this.data.result.errID ? this.data.result.errID : this.data.error
}
;
chivox.EnWordScore.prototype.getRank = function() {
    return this.data.result.rank
}
;
chivox.EnWordScore.prototype.getOverall = function() {
    return 100
}
;
chivox.EnWordScore.prototype.getWordSize = function() {
    return this.data.result.details.length
}
;
chivox.EnWordScore.prototype.getWord = function(a) {
    return new chivox.EnWordScore.Word(this.data.result.details[a])
}
;
chivox.EnWordScore.prototype.getCharSize = function() {
    return this.data.result.chars.length
}
;
chivox.EnWordScore.prototype.getChar = function(a) {
    return new chivox.EnWordScore.Char(this.data.result.chars[a])
}
;
chivox.EnWordScore.Word = function(a) {
    this.data = a
}
;
chivox.EnWordScore.Word.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.EnWordScore.Word.prototype.getDur = function() {
    return this.data.dur
}
;
chivox.EnWordScore.Word.prototype.getStress = function() {
    return this.data.stress
}
;
chivox.EnWordScore.Word.prototype.getScore = function() {
    return this.data.score
}
;
chivox.EnWordScore.Word.prototype.getPhoneSize = function() {
    return "undefined" == typeof this.data.phone ? 0 : this.data.phone.length
}
;
chivox.EnWordScore.Word.prototype.getPhone = function(a) {
    return new chivox.EnWordScore.Word.Phone(this.data.phone[a])
}
;
chivox.EnWordScore.Word.Phone = function(a) {
    this.data = a
}
;
chivox.EnWordScore.Word.Phone.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.EnWordScore.Word.Phone.prototype.getScore = function() {
    return this.data.score
}
;
chivox.EnWordScore.Char = function(a) {
    this.data = a
}
;
chivox.EnWordScore.Char.prototype.getChar = function() {
    return this.data["char"]
}
;
chivox.EnWordScore.Char.prototype.getNormalize = function() {
    return this.data.normalize
}
;
chivox.LocationSearch = {
    get: function() {
        var a = location.search
          , b = {};
        if ("" != a && "?" != a)
            for (i in a = a.substring(1).split("&"),
            a)
                if (0 != a.hasOwnProperty(i)) {
                    var c = a[i].split("=");
                    b[c[0]] = c[1]
                }
        return b
    },
    set: function(a) {
        var b = "?";
        for (i in a)
            0 != a.hasOwnProperty(i) && ("?" != b && (b += "&"),
            b += i + "=" + a[i]);
        window.location.search = b;
        return a
    },
    has: function(a) {
        var b = this.get();
        for (i in b)
            if (0 != b.hasOwnProperty(i) && i == a)
                return !0;
        return !1
    },
    attr: function(a, b) {
        var c = this.get();
        if ("undefined" != typeof a) {
            if ("undefined" == typeof b)
                return c[a];
            c[a] = b;
            this.set(c)
        }
    }
};
chivox.SpeechResource = {};
(function() {
    var a = {
        scoreType: "100",
        coreType: "",
        refText: "",
        userId: "guest",
        applicationId: "default",
        mode: ""
    };
    chivox.SpeechResource.setScoreType = function(b) {
        a.scoreType = b
    }
    ;
    chivox.SpeechResource.setCoreType = function(b) {
        a.coreType = {
            cnword: "cn.word.score",
            cnsent: "cn.sent.score",
            enword: "en.word.score",
            ensent: "en.sent.score"
        }[b] || ""
    }
    ;
    chivox.SpeechResource.setRefText = function(b) {
        a.refText = b
    }
    ;
    chivox.SpeechResource.setUserId = function(b) {
        a.userId = b
    }
    ;
    chivox.SpeechResource.setApplicationId = function(b) {
        a.applicationId = b
    }
    ;
    chivox.SpeechResource.setMode = function(b) {
        a.mode = b
    }
    ;
    chivox.SpeechResource.get = function() {
        return a
    }
}
)();
ai$(function() {
    chivox.updateMonitorLog = function(a) {}
});
