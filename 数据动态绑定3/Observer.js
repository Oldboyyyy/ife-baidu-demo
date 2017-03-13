/**
 * Created by yc on 2017-3-13.
 */
(function(){
    /**
     *
     * @param obj 要被监听的对象
     * @param dep 将其对象
     * @constructor 创建监听对象
     */
    var Observer = function(obj, dep){
        if(!obj || typeof obj !== 'object'){
            return;
        }
        this.data = obj;
        this.parent = dep;
        this.obObject(obj)
    }
    var o = Observer.prototype;

    o.obObject = function(obj){
        var _this = this;
        Object.keys(obj).forEach(function(attr){
            var val = obj[attr];
            var dep = new Dep(_this.parent);
            new Observer(val, dep);
            _this.convert(attr, val, dep)
        })
    }

    o.convert = function(attr, val, dep){
        var _this = this;
        Object.defineProperty(this.data, attr,{
            enumerable: true,
            configurable: false,
            get: function(){
                //console.log('get：key=' +attr+ ', value=' +val);
                if(Dep.target){
                    dep.addWatch(Dep.target); //将定位的位置推进，缓存事件回调的数组内
                }
                return val;
            },
            set: function(newVal){
                if(val === newVal){
                    return;
                }
                //console.log('set：key=' +attr+ ', value=' +val+ ', newVal=' +newVal);
                dep.notify(attr, val, newVal, _this);
                val = newVal;
                if(typeof newVal === 'object'){
                    new Observer(newVal, dep);
                }

            }
        })
    }

    o.$watch = function(event, cb){
        new Watcher(this, event, cb)
    }

    /**
     *
     * @param parent 上一级的订阅
     * @constructor 记录要监听的属性位于对象的层级
     */
    var Dep = function(parent){
        this.parent = parent;
        this.watchers = [];
    }

    var d = Dep.prototype;

    d.notify = function(attr, val, newVal, _this){
        this.watchers.forEach(function(watcher){
            watcher.update(attr, val, newVal, _this)
        })
        if(this.parent){
            this.parent.notify(attr, val, newVal, _this)
        }
    }

    d.addWatch = function(target){
        this.watchers.push(target);
    }

    /**
     *
     * @param ob 观察者对象
     * @param event 订阅的事件
     * @param cb 事件回调函数
     * @constructor 创建发布者对象
     */
    var Watcher = function(ob, event, cb){
        this.ob = ob;
        this.cb = cb;
        this.calculateDep(event);
    }

    var w = Watcher.prototype;

    w.calculateDep = function(event){
        var events = event.split('.')
        if(events.length === 1){
            this.register(this.ob.data, event)
        }else{
            var i = 1,
                deepValue = this.ob.data[events[0]];
            while(deepValue && i < events.length - 1) {
                deepValue = deepValue[events[i++]];
            }
            this.register( deepValue, events[i]);

        }

    }

    w.register = function(data, event){
        Dep.target = this;
        data[event];                    //记录需要监听属性的位置
        Dep.target = undefined;
    }

    w.update = function(){
        if(this.cb){
            this.cb.apply(this, arguments)
        }
    }

    window.Observer = Observer;
})()