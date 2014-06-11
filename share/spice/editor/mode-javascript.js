define("ace/mode/javascript", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/javascript_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range", "ace/worker/worker_client", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (e, t, n) {
    var r = e("../lib/oop");
    var i = e("./text").Mode;
    var s = e("../tokenizer").Tokenizer;
    var o = e("./javascript_highlight_rules").JavaScriptHighlightRules;
    var u = e("./matching_brace_outdent").MatchingBraceOutdent;
    var a = e("../range").Range;
    var f = e("../worker/worker_client").WorkerClient;
    var l = e("./behaviour/cstyle").CstyleBehaviour;
    var c = e("./folding/cstyle").FoldMode;
    var h = function () {
        this.HighlightRules = o;
        this.$outdent = new u;
        this.$behaviour = new l;
        this.foldingRules = new c
    };
    r.inherits(h, i);
    (function () {
        this.lineCommentStart = "//";
        this.blockComment = {
            start: "/*",
            end: "*/"
        };
        this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t);
            var i = this.getTokenizer().getLineTokens(t, e);
            var s = i.tokens;
            var o = i.state;
            if (s.length && s[s.length - 1].type == "comment") {
                return r
            }
            if (e == "start" || e == "no_regex") {
                var u = t.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
                if (u) {
                    r += n
                }
            } else if (e == "doc-start") {
                if (o == "start" || o == "no_regex") {
                    return ""
                }
                var u = t.match(/^\s*(\/?)\*/);
                if (u) {
                    if (u[1]) {
                        r += " "
                    }
                    r += "* "
                }
            }
            return r
        };
        this.checkOutdent = function (e, t, n) {
            return this.$outdent.checkOutdent(t, n)
        };
        this.autoOutdent = function (e, t, n) {
            this.$outdent.autoOutdent(t, n)
        };
        this.createWorker = function (e) {
            var t = new f(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
            t.attachToDocument(e.getDocument());
            t.on("jslint", function (t) {
                e.setAnnotations(t.data)
            });
            t.on("terminate", function () {
                e.clearAnnotations()
            });
            return t
        }
    }).call(h.prototype);
    t.Mode = h
});
define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop");
    var i = e("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var s = e("./text_highlight_rules").TextHighlightRules;
    var o = function () {
        var e = this.createKeywordMapper({
            "variable.language": "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|" + "Namespace|QName|XML|XMLList|" + "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|" + "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|" + "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|" + "SyntaxError|TypeError|URIError|" + "decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|" + "isNaN|parseFloat|parseInt|" + "JSON|Math|" + "this|arguments|prototype|window|document",
            keyword: "const|yield|import|get|set|" + "break|case|catch|continue|default|delete|do|else|finally|for|function|" + "if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|" + "__parent__|__count__|escape|unescape|with|__proto__|" + "class|enum|extends|super|export|implements|private|public|interface|package|protected|static",
            "storage.type": "const|let|var|function",
            "constant.language": "null|Infinity|NaN|undefined",
            "support.function": "alert",
            "constant.language.boolean": "true|false"
        }, "identifier");
        var t = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";
        var n = "[a-zA-Z\\$_Â¡-ï¿¿][a-zA-Z\\d\\$_Â¡-ï¿¿]*\\b";
        var r = "\\\\(?:x[0-9a-fA-F]{2}|" + "u[0-9a-fA-F]{4}|" + "[0-2][0-7]{0,2}|" + "3[0-6][0-7]?|" + "37[0-7]?|" + "[4-7][0-7]?|" + ".)";
        this.$rules = {
            no_regex: [{
                    token: "comment",
                    regex: "\\/\\/",
                    next: "line_comment"
                },
                i.getStartRule("doc-start"), {
                    token: "comment",
                    regex: /\/\*/,
                    next: "comment"
                }, {
                    token: "string",
                    regex: "'(?=.)",
                    next: "qstring"
                }, {
                    token: "string",
                    regex: '"(?=.)',
                    next: "qqstring"
                }, {
                    token: "constant.numeric",
                    regex: /0[xX][0-9a-fA-F]+\b/
                }, {
                    token: "constant.numeric",
                    regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
                }, {
                    token: ["storage.type", "punctuation.operator", "support.function", "punctuation.operator", "entity.name.function", "text", "keyword.operator"],
                    regex: "(" + n + ")(\\.)(prototype)(\\.)(" + n + ")(\\s*)(=)",
                    next: "function_arguments"
                }, {
                    token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"],
                    regex: "(" + n + ")(\\.)(" + n + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: ["entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"],
                    regex: "(" + n + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "entity.name.function", "text", "paren.lparen"],
                    regex: "(" + n + ")(\\.)(" + n + ")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: ["storage.type", "text", "entity.name.function", "text", "paren.lparen"],
                    regex: "(function)(\\s+)(" + n + ")(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: ["entity.name.function", "text", "punctuation.operator", "text", "storage.type", "text", "paren.lparen"],
                    regex: "(" + n + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: ["text", "text", "storage.type", "text", "paren.lparen"],
                    regex: "(:)(\\s*)(function)(\\s*)(\\()",
                    next: "function_arguments"
                }, {
                    token: "keyword",
                    regex: "(?:" + t + ")\\b",
                    next: "start"
                }, {
                    token: ["punctuation.operator", "support.function"],
                    regex: /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
                }, {
                    token: ["punctuation.operator", "support.function.dom"],
                    regex: /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
                }, {
                    token: ["punctuation.operator", "support.constant"],
                    regex: /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
                }, {
                    token: ["storage.type", "punctuation.operator", "support.function.firebug"],
                    regex: /(console)(\.)(warn|info|log|error|time|timeEnd|assert)\b/
                }, {
                    token: e,
                    regex: n
                }, {
                    token: "keyword.operator",
                    regex: /--|\+\+|[!$%&*+\-~]|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|\*=|%=|\+=|\-=|&=|\^=/,
                    next: "start"
                }, {
                    token: "punctuation.operator",
                    regex: /\?|\:|\,|\;|\./,
                    next: "start"
                }, {
                    token: "paren.lparen",
                    regex: /[\[({]/,
                    next: "start"
                }, {
                    token: "paren.rparen",
                    regex: /[\])}]/
                }, {
                    token: "keyword.operator",
                    regex: /\/=?/,
                    next: "start"
                }, {
                    token: "comment",
                    regex: /^#!.*$/
                }
            ],
            start: [i.getStartRule("doc-start"), {
                token: "comment",
                regex: "\\/\\*",
                next: "comment_regex_allowed"
            }, {
                token: "comment",
                regex: "\\/\\/",
                next: "line_comment_regex_allowed"
            }, {
                token: "string.regexp",
                regex: "\\/",
                next: "regex"
            }, {
                token: "text",
                regex: "\\s+|^$",
                next: "start"
            }, {
                token: "empty",
                regex: "",
                next: "no_regex"
            }],
            regex: [{
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                token: "string.regexp",
                regex: "/\\w*",
                next: "no_regex"
            }, {
                token: "invalid",
                regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
            }, {
                token: "constant.language.escape",
                regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?]/
            }, {
                token: "constant.language.delimiter",
                regex: /\|/
            }, {
                token: "constant.language.escape",
                regex: /\[\^?/,
                next: "regex_character_class"
            }, {
                token: "empty",
                regex: "$",
                next: "no_regex"
            }, {
                defaultToken: "string.regexp"
            }],
            regex_character_class: [{
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                token: "constant.language.escape",
                regex: "]",
                next: "regex"
            }, {
                token: "constant.language.escape",
                regex: "-"
            }, {
                token: "empty",
                regex: "$",
                next: "no_regex"
            }, {
                defaultToken: "string.regexp.charachterclass"
            }],
            function_arguments: [{
                token: "variable.parameter",
                regex: n
            }, {
                token: "punctuation.operator",
                regex: "[, ]+"
            }, {
                token: "punctuation.operator",
                regex: "$"
            }, {
                token: "empty",
                regex: "",
                next: "no_regex"
            }],
            comment_regex_allowed: [{
                token: "comment",
                regex: "\\*\\/",
                next: "start"
            }, {
                defaultToken: "comment"
            }],
            comment: [{
                token: "comment",
                regex: "\\*\\/",
                next: "no_regex"
            }, {
                defaultToken: "comment"
            }],
            line_comment_regex_allowed: [{
                token: "comment",
                regex: "$|^",
                next: "start"
            }, {
                defaultToken: "comment"
            }],
            line_comment: [{
                token: "comment",
                regex: "$|^",
                next: "no_regex"
            }, {
                defaultToken: "comment"
            }],
            qqstring: [{
                token: "constant.language.escape",
                regex: r
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qqstring"
            }, {
                token: "string",
                regex: '"|$',
                next: "no_regex"
            }, {
                defaultToken: "string"
            }],
            qstring: [{
                token: "constant.language.escape",
                regex: r
            }, {
                token: "string",
                regex: "\\\\$",
                next: "qstring"
            }, {
                token: "string",
                regex: "'|$",
                next: "no_regex"
            }, {
                defaultToken: "string"
            }]
        };
        this.embedRules(i, "doc-", [i.getEndRule("no_regex")])
    };
    r.inherits(o, s);
    t.JavaScriptHighlightRules = o
});
define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop");
    var i = e("./text_highlight_rules").TextHighlightRules;
    var s = function () {
        this.$rules = {
            start: [{
                token: "comment.doc.tag",
                regex: "@[\\w\\d_]+"
            }, {
                token: "comment.doc.tag",
                regex: "\\bTODO\\b"
            }, {
                defaultToken: "comment.doc"
            }]
        }
    };
    r.inherits(s, i);
    s.getStartRule = function (e) {
        return {
            token: "comment.doc",
            regex: "\\/\\*(?=\\*)",
            next: e
        }
    };
    s.getEndRule = function (e) {
        return {
            token: "comment.doc",
            regex: "\\*\\/",
            next: e
        }
    };
    t.DocCommentHighlightRules = s
});
define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (e, t, n) {
    var r = e("../range").Range;
    var i = function () {};
    (function () {
        this.checkOutdent = function (e, t) {
            if (!/^\s+$/.test(e)) return false;
            return /^\s*\}/.test(t)
        };
        this.autoOutdent = function (e, t) {
            var n = e.getLine(t);
            var i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length;
            var o = e.findMatchingBracket({
                row: t,
                column: s
            });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u)
        };
        this.$getIndent = function (e) {
            return e.match(/^\s*/)[0]
        }
    }).call(i.prototype);
    t.MatchingBraceOutdent = i
});
define("ace/mode/behaviour/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour", "ace/token_iterator", "ace/lib/lang"], function (e, t, n) {
    var r = e("../../lib/oop");
    var i = e("../behaviour").Behaviour;
    var s = e("../../token_iterator").TokenIterator;
    var o = e("../../lib/lang");
    var u = ["text", "paren.rparen", "punctuation.operator"];
    var a = ["text", "paren.rparen", "punctuation.operator", "comment"];
    var f = 0;
    var l = -1;
    var c = "";
    var h = 0;
    var p = -1;
    var d = "";
    var v = "";
    var m = function () {
        m.isSaneInsertion = function (e, t) {
            var n = e.getCursorPosition();
            var r = new s(t, n.row, n.column);
            if (!this.$matchTokenType(r.getCurrentToken() || "text", u)) {
                var i = new s(t, n.row, n.column + 1);
                if (!this.$matchTokenType(i.getCurrentToken() || "text", u)) return false
            }
            r.stepForward();
            return r.getCurrentTokenRow() !== n.row || this.$matchTokenType(r.getCurrentToken() || "text", a)
        };
        m.$matchTokenType = function (e, t) {
            return t.indexOf(e.type || e) > -1
        };
        m.recordAutoInsert = function (e, t, n) {
            var r = e.getCursorPosition();
            var i = t.doc.getLine(r.row);
            if (!this.isAutoInsertedClosing(r, i, c[0])) f = 0;
            l = r.row;
            c = n + i.substr(r.column);
            f++
        };
        m.recordMaybeInsert = function (e, t, n) {
            var r = e.getCursorPosition();
            var i = t.doc.getLine(r.row);
            if (!this.isMaybeInsertedClosing(r, i)) h = 0;
            p = r.row;
            d = i.substr(0, r.column) + n;
            v = i.substr(r.column);
            h++
        };
        m.isAutoInsertedClosing = function (e, t, n) {
            return f > 0 && e.row === l && n === c[0] && t.substr(e.column) === c
        };
        m.isMaybeInsertedClosing = function (e, t) {
            return h > 0 && e.row === p && t.substr(e.column) === v && t.substr(0, e.column) == d
        };
        m.popAutoInsertedClosing = function () {
            c = c.substr(1);
            f--
        };
        m.clearMaybeInsertedClosing = function () {
            h = 0;
            p = -1
        };
        this.add("braces", "insertion", function (e, t, n, r, i) {
            var s = n.getCursorPosition();
            var u = r.doc.getLine(s.row);
            if (i == "{") {
                var a = n.getSelectionRange();
                var f = r.doc.getTextRange(a);
                if (f !== "" && f !== "{" && n.getWrapBehavioursEnabled()) {
                    return {
                        text: "{" + f + "}",
                        selection: false
                    }
                } else if (m.isSaneInsertion(n, r)) {
                    if (/[\]\}\)]/.test(u[s.column])) {
                        m.recordAutoInsert(n, r, "}");
                        return {
                            text: "{}",
                            selection: [1, 1]
                        }
                    } else {
                        m.recordMaybeInsert(n, r, "{");
                        return {
                            text: "{",
                            selection: [1, 1]
                        }
                    }
                }
            } else if (i == "}") {
                var l = u.substring(s.column, s.column + 1);
                if (l == "}") {
                    var c = r.$findOpeningBracket("}", {
                        column: s.column + 1,
                        row: s.row
                    });
                    if (c !== null && m.isAutoInsertedClosing(s, u, i)) {
                        m.popAutoInsertedClosing();
                        return {
                            text: "",
                            selection: [1, 1]
                        }
                    }
                }
            } else if (i == "\n" || i == "\r\n") {
                var p = "";
                if (m.isMaybeInsertedClosing(s, u)) {
                    p = o.stringRepeat("}", h);
                    m.clearMaybeInsertedClosing()
                }
                var l = u.substring(s.column, s.column + 1);
                if (l == "}" || p !== "") {
                    var d = r.findMatchingBracket({
                        row: s.row,
                        column: s.column
                    }, "}");
                    if (!d) return null;
                    var v = this.getNextLineIndent(e, u.substring(0, s.column), r.getTabString());
                    var g = this.$getIndent(u);
                    return {
                        text: "\n" + v + "\n" + g + p,
                        selection: [1, v.length, 1, v.length]
                    }
                }
            }
        });
        this.add("braces", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "{") {
                var o = r.doc.getLine(i.start.row);
                var u = o.substring(i.end.column, i.end.column + 1);
                if (u == "}") {
                    i.end.column++;
                    return i
                } else {
                    h--
                }
            }
        });
        this.add("parens", "insertion", function (e, t, n, r, i) {
            if (i == "(") {
                var s = n.getSelectionRange();
                var o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled()) {
                    return {
                        text: "(" + o + ")",
                        selection: false
                    }
                } else if (m.isSaneInsertion(n, r)) {
                    m.recordAutoInsert(n, r, ")");
                    return {
                        text: "()",
                        selection: [1, 1]
                    }
                }
            } else if (i == ")") {
                var u = n.getCursorPosition();
                var a = r.doc.getLine(u.row);
                var f = a.substring(u.column, u.column + 1);
                if (f == ")") {
                    var l = r.$findOpeningBracket(")", {
                        column: u.column + 1,
                        row: u.row
                    });
                    if (l !== null && m.isAutoInsertedClosing(u, a, i)) {
                        m.popAutoInsertedClosing();
                        return {
                            text: "",
                            selection: [1, 1]
                        }
                    }
                }
            }
        });
        this.add("parens", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "(") {
                var o = r.doc.getLine(i.start.row);
                var u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == ")") {
                    i.end.column++;
                    return i
                }
            }
        });
        this.add("brackets", "insertion", function (e, t, n, r, i) {
            if (i == "[") {
                var s = n.getSelectionRange();
                var o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled()) {
                    return {
                        text: "[" + o + "]",
                        selection: false
                    }
                } else if (m.isSaneInsertion(n, r)) {
                    m.recordAutoInsert(n, r, "]");
                    return {
                        text: "[]",
                        selection: [1, 1]
                    }
                }
            } else if (i == "]") {
                var u = n.getCursorPosition();
                var a = r.doc.getLine(u.row);
                var f = a.substring(u.column, u.column + 1);
                if (f == "]") {
                    var l = r.$findOpeningBracket("]", {
                        column: u.column + 1,
                        row: u.row
                    });
                    if (l !== null && m.isAutoInsertedClosing(u, a, i)) {
                        m.popAutoInsertedClosing();
                        return {
                            text: "",
                            selection: [1, 1]
                        }
                    }
                }
            }
        });
        this.add("brackets", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "[") {
                var o = r.doc.getLine(i.start.row);
                var u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == "]") {
                    i.end.column++;
                    return i
                }
            }
        });
        this.add("string_dquotes", "insertion", function (e, t, n, r, i) {
            if (i == '"' || i == "'") {
                var s = i;
                var o = n.getSelectionRange();
                var u = r.doc.getTextRange(o);
                if (u !== "" && u !== "'" && u != '"' && n.getWrapBehavioursEnabled()) {
                    return {
                        text: s + u + s,
                        selection: false
                    }
                } else {
                    var a = n.getCursorPosition();
                    var f = r.doc.getLine(a.row);
                    var l = f.substring(a.column - 1, a.column);
                    if (l == "\\") {
                        return null
                    }
                    var c = r.getTokens(o.start.row);
                    var h = 0,
                        p;
                    var d = -1;
                    for (var v = 0; v < c.length; v++) {
                        p = c[v];
                        if (p.type == "string") {
                            d = -1
                        } else if (d < 0) {
                            d = p.value.indexOf(s)
                        }
                        if (p.value.length + h > o.start.column) {
                            break
                        }
                        h += c[v].value.length
                    }
                    if (!p || d < 0 && p.type !== "comment" && (p.type !== "string" || o.start.column !== p.value.length + h - 1 && p.value.lastIndexOf(s) === p.value.length - 1)) {
                        if (!m.isSaneInsertion(n, r)) return;
                        return {
                            text: s + s,
                            selection: [1, 1]
                        }
                    } else if (p && p.type === "string") {
                        var g = f.substring(a.column, a.column + 1);
                        if (g == s) {
                            return {
                                text: "",
                                selection: [1, 1]
                            }
                        }
                    }
                }
            }
        });
        this.add("string_dquotes", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && (s == '"' || s == "'")) {
                var o = r.doc.getLine(i.start.row);
                var u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == s) {
                    i.end.column++;
                    return i
                }
            }
        })
    };
    r.inherits(m, i);
    t.CstyleBehaviour = m
});
define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
    var r = e("../../lib/oop");
    var i = e("../../range").Range;
    var s = e("./fold_mode").FoldMode;
    var o = t.FoldMode = function (e) {
        if (e) {
            this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start));
            this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end))
        }
    };
    r.inherits(o, s);
    (function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;
        this.getFoldWidgetRange = function (e, t, n) {
            var r = e.getLine(n);
            var i = r.match(this.foldingStartMarker);
            if (i) {
                var s = i.index;
                if (i[1]) return this.openingBracketBlock(e, i[1], n, s);
                return e.getCommentFoldRange(n, s + i[0].length, 1)
            }
            if (t !== "markbeginend") return;
            var i = r.match(this.foldingStopMarker);
            if (i) {
                var s = i.index + i[0].length;
                if (i[1]) return this.closingBracketBlock(e, i[1], n, s);
                return e.getCommentFoldRange(n, s, -1)
            }
        }
    }).call(o.prototype)
})
