/**
 * Created by yc on 2017-3-13.
 */
(function(){
    var Vue = function (obj){
        this.init.call(this,obj)
    }
    var v = Vue.prototype;

    v.init = function(obj){
        var ob = new Observer(obj);
        this.el = document.querySelector(obj.el);
        this.tpl = this.el.innerHTML;
        this.data = ob.data.data;
        this.render();
    }

    v.parseTpl = function(){
        var reult = [],
            reg = /{{(.*?)}}/g,
            html = this.tpl,
            res = reg.exec(html);
        while(res){
            reult.push(res[1]);
            res = reg.exec(html)
        }
        return reult;

    }

    v.getValue = function(data, key){
        var attrs = key.split('.');
        return  data[attrs[0]][attrs[1]];
    }
    v.render = function(){
        var result = this.parseTpl()
        var reg = /{{(.*?)}}/;
        var _this = this;
        var html = _this.tpl

        result.forEach(function(attr){
            var val =_this.getValue(_this.data, attr)
            console.log(val)
            html = html.replace(reg, val)
        })

        _this.el.innerHTML = html;
    }
    window.Vue = Vue;
})()