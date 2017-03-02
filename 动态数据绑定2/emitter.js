/**
 * Created by yc on 2017-3-2.
 */
;(function(){
    var Emitter = function(){
        this.cache = {}
    }
    var e = Emitter.prototype;
    e.on = function(key, cb){
        if(!this.cache[key] ) this.cache[key] = [];
        this.cache[key].push(cb);
    }
    e.off = function(key, cb){
        var fns = this.cache[key];
        if(!fns) return;
        if(!cb){
            this.cache[key] = [];
        }else{
            for(var l = fns.length - 1; l >= 0; l--){
                var _fn = fns[l];
                if(_fn === cb){
                    fns.splice(l, 1)
                }
            }
        }
    }
    e.emit = function(){
        var key = [].shift.call(arguments);
        var fns = this.cache[key];
        if(!fns || fns.length === 0) return;
        for(var i = 0,l = fns.length; i < l; i++){
            fns[i].apply(this, arguments);
        }

    }
    window.Emitter = Emitter;
})()