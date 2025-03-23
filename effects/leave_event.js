(() => {
    // 配置部分
    const leaveDelay = 30; // 触发事件的延迟，单位为秒
    const leaveFavicon = null; // 触发事件后的图标路径，设置为 null 表示不替换图标
    const leaveTitle = "\u00A0Not\u00A0a\u00A0marionette...\u00A0気づいてよ\u00A0"; // 触发事件后的标题
    const returnTitle = "\u00A0届くと そう\u00A0信じたいんだよ\u00A0それが証となるって思うんだ\u00A0"; // 回归之后的标题
  
    // 代码部分
    let originTitle = "";
    const saveTitle = () => {
      originTitle = document.title;
    };
    let scrolling = true;

    function scrollTitle() {
        if (!scrolling) return;
        //document.title = title;
        document.title = document.title.slice(1) + document.title[0]; // Shift characters
        setTimeout(scrollTitle, 400);
    }
  
    let inactiveTimeout = null;
    const siteFavicon = document.querySelector('[rel="icon"]');
    const originFaviconUrl = siteFavicon.getAttribute("href");
    document.addEventListener("visibilitychange", (ev) => {
      if (ev.target.hidden) {
        // 触发离开事件，开始计时
        inactiveTimeout = setTimeout(() => {
          document.title = leaveTitle;
          scrollTitle();
          scrolling = true;
          if (leaveFavicon) {
            siteFavicon.setAttribute("href", leaveFavicon);
          }
          inactiveTimeout = null;
        }, leaveDelay * 1000);
      } else {
        // 触发回归事件
        if (inactiveTimeout !== null) {
          // 还在计时，（假装）无事发生
          clearTimeout(inactiveTimeout);
          inactiveTimeout = null;
        } else {
          // 回归了，庆祝一下
          document.title = returnTitle;
          scrollTitle();
          scrolling = true;
          if (leaveFavicon) {
            siteFavicon.setAttribute("href", originFaviconUrl);
          }
          // 稍等一等再把标题改回来
          setTimeout(() => {
            document.title = originTitle;
            scrolling = false;
          }, 10000);
        }
      }
    });
  
  
    // 保存标题
    saveTitle();
    // 在 PJAX 之后再保存标题
    window.addEventListener('pjax:complete', saveTitle);
  })();
  