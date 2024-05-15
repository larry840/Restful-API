<img src="https://github.com/larry840/Restful-API/assets/137968655/73c8e3c8-c764-4d03-bf73-4aea82cbc2e8" alt="" width='384px' height='216px'/>
<img src="https://github.com/larry840/Restful-API/assets/137968655/c964d60a-64f0-4377-86bc-ded3fbfb9245" alt="" width='384px' height='216px'/>
<br>
<img src="https://github.com/larry840/Restful-API/assets/137968655/704c51ad-7a94-4364-b4da-bc91902748f1" alt="" width='384px' height='216px'/>
<img src="https://github.com/larry840/Restful-API/assets/137968655/4be2255c-0eb3-428c-8463-64a02afe7d83" alt="" width='384px' height='216px'/>

寫一個簡單的網頁，透過Express和Mongoose管理學生資料並進行CRUD操作。
學習要點：
1. 學習使用MongoDB及Mongoose儲存、取用資料，在models資料夾中建立Schema定義data的結構
2. method-override這個middleware運行HTTP PUT和DELETE request
3. 使用 Express 的路由參數來處理動態路由，如：/students/:_id、/students/:_id/edit等等，並學習params的用法
4. 練習使用async function語法，try catch及await等等
5. 建立views資料夾存放各個頁面的ejs，在app.js中使用return res.render("students", { studentData });可連接至該頁面並傳送data顯示出來
