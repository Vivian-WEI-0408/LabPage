/** Shared site footer: edit this template once to update every page. */
const footer = document.querySelector('footer#contact');

if (footer) {
  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <b>Chen Ye Lab</b>
        <span>Institute of Synthetic Biology</span>
      </div>
      <div class="footer-logos" aria-label="所属及合作机构">
        <img class="footer-logo footer-logo-wide" src="static/2025022102395969034.png" alt="iSynBio Institute of Synthetic Biology">
        <span class="logo-divider" aria-hidden="true"></span>
        <img class="footer-logo footer-logo-square" src="static/szxjy-zjxjy-logo.png" alt="合作研究机构">
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-contact">
        <p>CONTACT US / 联系我们</p>
        <a href="mailto:ye.chen@siat.ac.cn">ye.chen@siat.ac.cn</a>
        <span>中国广东省深圳市光明区永创路与羌下一路（东）交叉口东侧 120 米</span>
      </div>
      <div class="footer-links">
        <p>QUICK LINKS / 快速链接</p>
        <a href="index.html">首页</a>
        <a href="team.html">团队</a>
        <a href="research.html">研究</a>
        <a href="join.html">加入我们</a>
      </div>
      <div class="footer-end">
        <span>© 2026 CHEN YE LAB</span>
        <button class="to-top" type="button" aria-label="回到顶部">↑</button>
      </div>
    </div>`;
}
