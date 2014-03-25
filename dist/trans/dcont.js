/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/trans/dcont.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu-stream/stream", "./unique", "../structure", "../_tail"], (function(require, exports,
    __o, UniqueT, __o0, __o1) {
    "use strict";
    var append = __o["append"],
        cons = __o["cons"],
        first = __o["first"],
        rest = __o["rest"],
        isEmpty = __o["isEmpty"],
        NIL = __o["NIL"],
        Monad = __o0["Monad"],
        Transformer = __o0["Transformer"],
        Tail = __o1["Tail"],
        trampoline = __o1["trampoline"],
        DContT, Seg = (function(f) {
            var self = this;
            (self.frame = f);
        }),
        P = (function(t) {
            var self = this;
            (self.prompt = t);
        }),
        empty = NIL,
        push = cons,
        pushSeq = append,
        pushP = (function(t, k) {
            return push(new(P)(t), k);
        }),
        pushSeg = (function(f, k) {
            return push(new(Seg)(f), k);
        }),
        splitSeq = (function(t, k) {
            if (isEmpty(k)) return [empty, empty];
            var x = first(k),
                xs = rest(k);
            if (((x instanceof P) && (x.prompt === t))) return [empty, xs];
            var __o = splitSeq(t, xs),
                a = __o[0],
                b = __o[1];
            return [push(x, a), b];
        }),
        DContMonad = (function(instance, newPrompt, pushPrompt, withSubCont, pushSubCont) {
            (instance.newPrompt = (instance.prototype.newPrompt = newPrompt));
            (instance.pushPrompt = (instance.prototype.pushPrompt = pushPrompt));
            (instance.withSubCont = (instance.prototype.withSubCont = withSubCont));
            (instance.pushSubCont = (instance.prototype.pushSubCont = pushSubCont));
            (instance.reset = (instance.prototype.reset = (function(f) {
                return newPrompt.chain((function(p) {
                    return pushPrompt(p, f(p));
                }));
            })));
            (instance.shift = (instance.prototype.shift = (function(p, f) {
                var t = this;
                return withSubCont(p, (function(k) {
                    return pushPrompt(p, f((function(c) {
                        return pushPrompt(p, pushSubCont(k, c));
                    })));
                }));
            })));
            return instance;
        }),
        unDContT = (function(m, k) {
            return new(Tail)(m.run, k);
        }),
        runDContT = (function(f, g) {
            return (function() {
                return f(g.apply(null, arguments));
            });
        })((function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(UniqueT.runUniqueT, trampoline), unDContT);
    (DContT = (function(m) {
        var M = UniqueT(m),
            Instance = (function(run) {
                var self = this;
                (self.run = run);
            }),
            appk = (function(k, x) {
                var c = k;
                do {
                    if (((typeof c) === "function")) return M.of(c(x));
                    var top = first(c);
                    if ((top instanceof Seg)) return unDContT(top.frame(x), rest(c));
                    (c = ((top instanceof P) ? rest(c) : top));
                }
                while (true);
            });
        Monad(Instance, (function(x) {
            return new(Instance)((function(k) {
                return appk(k, x);
            }));
        }), (function(c, f) {
            return new(Instance)((function(k) {
                return unDContT(c, pushSeg(f, k));
            }));
        }));
        Transformer(Instance, m, (function(t) {
            return new(Instance)((function(k) {
                return M.lift(t.map(trampoline))
                    .chain((function(f, g) {
                        return (function(x) {
                            return f(g(x));
                        });
                    })(trampoline, appk.bind(null, k)));
            }));
        }));
        DContMonad(Instance, new(Instance)((function(k) {
            return M.unique.chain((function(f, g) {
                return (function(x) {
                    return f(g(x));
                });
            })(trampoline, appk.bind(null, k)));
        })), (function(prompt, c) {
            return new(Instance)((function(k) {
                return unDContT(c, pushP(prompt, k));
            }));
        }), (function(prompt, f) {
            return new(Instance)((function(k) {
                var __o = splitSeq(prompt, k),
                    x = __o[0],
                    xs = __o[1];
                return unDContT(f(x), xs);
            }));
        }), (function(subk, c) {
            return new(Instance)((function(k) {
                return unDContT(c, pushSeq(subk, k));
            }));
        }));
        return Instance;
    }));
    (DContT.runDContT = (function(m, k) {
        return runDContT(m, push(k, empty));
    }));
    return DContT;
}));