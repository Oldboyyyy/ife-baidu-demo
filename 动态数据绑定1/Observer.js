/**
 * Created by yc on 2017-3-1.
 */
;(function(){
    var Observer = function(data){
        this.data = data;
        this.walk(data);
    }
    var p = Observer.prototype;
    p.walk = function(obj){
        var val;
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                val = obj[key];
                if(typeof val === 'object'){
                    new Observer(val)
                }
                this.convert(key, val);
            }
        }
    }
    p.convert = function(key, val){
        Object.defineProperty(this.data, key, {
            enumerable: true,//可枚举的
            configurable: true,//可修改
            get: function(){
                console.log('访问了' + key);
                return val;
            },
            set: function(newVal){
                console.log('设置了' + key);
                console.log('新的' + key + '=' + newVal);
                if(newVal === val) return;
                val = newVal;
            }
        })
    }
    window.Observer = Observer;
})()