import { C } from "./theme";

export const CSS=`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${C.bg};font-family:'Segoe UI',system-ui,sans-serif;font-size:16px;color:#1a1a1a;overflow-x:hidden}
#root{height:100%}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;background:${C.navy};color:#fff;overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column}
.sidebar-logo{padding:20px 16px 12px;border-bottom:1px solid rgba(201,168,76,.2)}
.sidebar-logo h1{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:1px;line-height:1.3}
.sidebar-logo p{font-size:10px;color:rgba(255,255,255,.4);margin-top:3px}
.nav-group{padding:14px 16px 4px;font-size:8.5px;font-weight:700;letter-spacing:2px;color:rgba(201,168,76,.5);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 16px;cursor:pointer;font-size:14px;font-weight:500;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .15s;user-select:none}
.nav-item:hover,.nav-item.active{color:${C.gold};background:rgba(201,168,76,.08);border-left-color:${C.gold};font-weight:700}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.main{flex:1;overflow-y:auto;background:${C.bg}}
.page{max-width:700px;margin:0 auto;padding:22px 18px 40px}
.page-header{margin-bottom:20px}
.page-header h2{font-size:26px;font-weight:900;color:${C.navy};line-height:1.2}
.page-header h2 em{color:${C.red};font-style:normal}
.page-header p{font-size:15px;color:${C.muted};margin-top:6px;line-height:1.6}
.tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 8px;border-radius:10px;margin-bottom:8px}
.tag-red{background:rgba(220,38,38,.12);color:${C.red};border:1px solid rgba(220,38,38,.2)}
.tag-navy{background:rgba(30,58,95,.1);color:${C.navy};border:1px solid rgba(30,58,95,.2)}
.tag-gold{background:rgba(201,168,76,.12);color:#b8860b;border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(22,163,74,.1);color:${C.green};border:1px solid rgba(22,163,74,.2)}
.tag-blue{background:rgba(37,99,235,.1);color:#2563eb;border:1px solid rgba(37,99,235,.2)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px 12px}
.stat-val{font-size:26px;font-weight:900;line-height:1}
.stat-lbl{font-size:11px;color:${C.muted};margin-top:5px;letter-spacing:.5px;text-transform:uppercase}
.stat-sub{font-size:13px;color:${C.muted};margin-top:3px;line-height:1.3}
.fact{border-radius:5px;padding:12px 14px;margin-bottom:10px;border-left:4px solid}
.fact-red{background:#fef2f2;border-color:${C.red}}
.fact-gold{background:#fffbeb;border-color:${C.gold}}
.fact-green{background:#f0fdf4;border-color:${C.green}}
.fact-blue{background:#eff6ff;border-color:#2563eb}
.fact-label{font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:5px;text-transform:uppercase}
.fact-text{font-size:15px;line-height:1.7}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border:none;border-radius:4px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-navy{background:${C.navy};color:#fff}
.btn-gold{background:${C.gold};color:#fff}
.btn-red{background:${C.red};color:#fff}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.border}}
.btn-full{width:100%;justify-content:center;margin-bottom:10px}
.ai-panel{background:#f8f6f2;border:1px solid #e0d8cc;border-left:4px solid #1e3a5f;border-radius:5px;padding:14px 16px;margin-bottom:12px}
.ai-panel-label{font-size:10px;font-weight:800;color:#1e3a5f;letter-spacing:1.5px;margin-bottom:10px;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.ai-text{font-size:13px;color:#2d2a22;line-height:1.85}
.card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px;margin-bottom:10px}
.card-title{font-size:16px;font-weight:700;color:${C.navy};margin-bottom:4px}
.card-sub{font-size:14.5px;color:${C.muted};line-height:1.5}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:2px solid ${C.border};padding-bottom:8px;flex-wrap:wrap}
.tab{padding:8px 16px;border:none;border-radius:4px 4px 0 0;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;background:#f0ebe2;color:${C.muted};transition:all .12s}
.tab.active{background:${C.navy};color:${C.gold}}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.dash-card{background:#fff;border:1px solid ${C.border};border-radius:8px;padding:16px;cursor:pointer;transition:all .15s;border-left:4px solid}
.dash-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
.dash-card-icon{font-size:20px;margin-bottom:8px}
.dash-card-title{font-size:14px;font-weight:700;color:${C.navy};margin-bottom:3px}
.dash-card-sub{font-size:12.5px;color:${C.muted};line-height:1.4}
.topbar{display:none;background:${C.navy};color:#fff;align-items:stretch;position:sticky;top:0;z-index:100;flex-direction:column}
.topbar-title{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:.5px}
.menu-btn{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0;line-height:1}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200}
.overlay.open{display:block}
.sidebar.mobile-open{transform:translateX(0)!important}
.spin{animation:spin .7s linear infinite;display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%}
@keyframes spin{to{transform:rotate(360deg)}}
.clamp-box{background:#fff;border:1px solid ${C.border};border-radius:5px;padding:12px 14px;margin-bottom:10px;cursor:pointer;border-left:3px solid ${C.navy}}
.clamp-title{font-size:12.5px;font-weight:600;color:${C.navy};line-height:1.4}
.alert-banner{background:#fef2f2;border:1px solid #fca5a5;border-left:4px solid ${C.red};border-radius:4px;padding:10px 13px;margin-bottom:14px}
.alert-label{font-size:10px;font-weight:700;color:${C.red};letter-spacing:1px;margin-bottom:3px}
.alert-text{font-size:13.5px;color:#7f1d1d;line-height:1.6}
.source-bar{background:#eff3f8;border:1px solid #93b4d4;border-radius:4px;padding:11px 13px;margin-top:14px}
.source-label{font-size:10px;font-weight:700;color:${C.navy};letter-spacing:1px;margin-bottom:6px}
.source-links{display:flex;gap:8px;flex-wrap:wrap}
.source-link{font-size:12px;color:${C.navy};text-decoration:none;border:1px solid #93b4d4;padding:3px 8px;border-radius:3px;background:#fff}
.source-link:hover{background:${C.navy};color:#fff}
@media(max-width:768px){
  .app{flex-direction:column}
  .sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;z-index:300;transform:translateX(-100%);transition:transform .25s}
  .sidebar.mobile-open{transform:translateX(0)}
  .topbar{display:flex;height:auto;min-height:52px;position:fixed;top:0;left:0;right:0;z-index:200;flex-direction:column}
  .menu-btn{width:44px;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;padding:0}
  .topbar-title{font-size:10.5px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.3px;font-weight:800}
  .main{width:100%;margin-top:88px;overflow-y:auto;height:calc(100vh - 88px)}
  .page{padding:14px 12px 60px;max-width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .dash-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-val{font-size:21px}
  .stat-lbl{font-size:10px}
  .stat-sub{font-size:12.5px}
  .page-header h2{font-size:23px}
  .tabs{gap:3px}
  .tab{padding:7px 10px;font-size:12px}
  .btn{font-size:12.5px;padding:8px 14px}
  .dash-card{padding:12px}
  .dash-card-title{font-size:11.5px}
  .dash-card-sub{font-size:10px}
}
@media(max-width:400px){
  .dash-grid{grid-template-columns:1fr}
  .page{padding:12px 10px 60px}
  .stats-grid{grid-template-columns:1fr 1fr}
}
`;

// --- NAV DATA ---
