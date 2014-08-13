!function(navigator, window) {
    var now = Date.now;
    function nowTime() {
        return now();
    }
    var micro = function() {
        var loadTime;
        var performance = window.performance;
        if (performance && performance.now) {
            return function() {
                return performance.now();
            };
        }
        loadTime = now();
        return function() {
            return now() - loadTime;
        };
    }();
    window.Time = {
        now: nowTime,
        micro: micro
    };
}(navigator, window, document);