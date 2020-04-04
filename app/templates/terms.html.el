<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"></meta>
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
<meta name="Description" content="<%=trans('MES_TERMS_DESCR')%>"></meta>
<link rel="shortcut icon" href="/static/favicon.ico" />
<link rel="icon" type="image/png" href="/static/favicon.png" />


<title>DrakonHub Terms of Service</title>

<!-- Copyright 2015-2019 DRAKON Labs -->

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
/* -- end of reset.css -- */

td {
	vertical-align: middle;
}
</style>

<style>

@font-face {
	font-family: 'Ubuntu';
	src: url('/static/fonts/Ubuntu-Regular.ttf') format('truetype');
}

@font-face {
	font-family: 'Ubuntu';
	src: url('/static/fonts/Ubuntu-Italic.ttf') format('truetype');
	font-style: italic;
}

@font-face {
	font-family: 'Ubuntu';
	src: url('/static/fonts/Ubuntu-Bold.ttf') format('truetype');
	font-weight: bold;
}

@font-face {
	font-family: 'Ubuntu';
	src: url('/static/fonts/Ubuntu-BoldItalic.ttf') format('truetype');
	font-style: italic;
	font-weight: bold;
}

body, select, input {
	font-family: Ubuntu, Arial;
	font-size: 11pt;
}

strong {
	font-weight: bold;
}

p {
	margin:10px;
	line-height: 130%;
	text-align: justify;
}

h1 {
	text-align: center;
	
	font-size:110%;
	font-weight:bold;
	margin: 5px;
	margin-top:30px;
}

h2 {
	text-align: center;
	
	font-size:120%;
	font-weight:bold;
	padding: 5px;
	padding-top:10px;
}

h3 {
	text-align: left;
	color: #455A64;
	font-size:100%;
	font-weight:bold;
	margin: 5px;
	margin-top:30px;
}

.center {
	margin:auto;
}

.full_screen {
	width:100%;
	height:100vh;
	position: absolute;
	left:0px;
	top:0px;
}

.abs {
	position:absolute;
	left:0px;
	top:0px;
	display:none;
}

.panic_button {
	display: block;
	background: #455A64;
	color:white;
	border-radius: 5px;
	padding: 10px;
	margin: 10px;
	text-align: center;
	cursor: pointer;
}

.panic_button:active {
	transform: translate(0px, 2px);
}

.no_under {
	text-decoration: none;
}

.black_link {
	color:black;
}

.dia_button {
	display: inline-block;
	background: #455A64;
	color:white;
	border-radius: 5px;
	padding: 10px;
	margin: 10px;
	text-align: center;
	cursor: pointer;
}

.top_line {
	background: #455A64;
	color:white;
}

textarea:focus, input:focus{
    outline: none;
}

input {
	border: none;
	font-size:13pt;
	padding:6px;
}

.search_label {
	vertical-align: top;
/*
	border: solid 1px #455A64;
	border-radius:5px;
*/
}

.path {
	border-bottom: solid 1px #D9DCEC;
}

.path p {
	font-size: 13pt;
	margin:10px;
}

.line:hover {
	background:#E2EDF5;
}

.fav_line {
	background:#d3ffce;
}

.fav_line:hover {
	background:#E2EDF5;
}




#popup_menu {
	position:absolute;
	border: solid 1px #455A64;
	background:white;
}

.pm_item {
	padding:10px;
	cursor:pointer;
}

.pm_item:hover {
	background:#E2EDF5;
}

.pm_item:active {
	background:#455A64;
	color:white;
}

.pm_item:link {
	color:black;
}

.active_icon:hover {
	background:#455A64;
	color:white;
}

.mid {
	margin-left:5px;
	margin-right:5px;
	vertical-align:middle;
	cursor: pointer;
}

input[type=checkbox]
{
  /* Double-sized Checkboxes */
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
 
}


.shadow {
	box-shadow: 0px 0px 5px #000000;
}

.msgbox_t {
  box-sizing: border-box;
  resize: none;
  outline: none;
  width: 100%;
  padding: 10px;
  border: none;
  height: 180px;
  margin: 0px;
  border: solid 1px #707070;

  vertical-align: top;
  
  	font-family: Ubuntu, Arial;
	font-size: 13pt;
}

.empty_td {

	width: 52px;
}

.micon {
	vertical-align:middle;
	margin-right: 5px;
}

.light_border {
	border: solid 1px #D9DCEC;
}

</style>


<style>



#tooltip {
	position: absolute;
	background-color: #ffffdd;
	color: black;
	padding: 5px;
	border: solid 1px #909000;
	border-radius: 5px;
	
}


.ro_label {
	position: absolute;
	display: inline-block;
	padding: 5px;
	background: Lavender;
	border-radius: 5px;
	top: 5px;
	right: 5px;
}


.normal_section {
	max-width:1100px; 
	margin:auto; 
	background:white; 
	height:100vh; 
}



.white_button {
	display: inline-block;
	cursor: pointer;
	margin: 0px;
	padding: 5px;
	color: #455A64;
	background:white;
	border-radius:8px;
}

.white_button:active {
	transform: translate(0px, 2px);
}

.feedback {

	display: inline-block;
	position: absolute;
	right: 3px;
	bottom: 3px;
	color: white;
	background: #ff4f30;
	padding:3px;
	cursor:pointer;
	border-radius: 3px;
	border: solid 1px black;
}

.feedback:active {

	transform: translate(0px, 2px);
}

</style>

<style>

.fixed_back {
	background-color: black;
	position: absolute;
    left: 0px;
    top: 0px;	
    height: 100%;
    width: 100%;
    opacity: 0.2;
    display: "none";
}


.fixed_dialog {
	background-color: white;
	margin:auto;
	text-align: center;
	position: absolute;
	top: 10px;
	left:calc(50% - 160px);
	width:320px;

}

table.form_table td {
	padding: 5px;
}

table.form_table input {
	border: solid 1px grey;
	font-size: 11pt;
}

.topMenuItem {
	color: #BE2921;
	display: inline-block;
	padding:4px 9px 4px 9px;
	margin: 10px 2px 10px 0px;
	border-radius: 18px;
	border: 1px solid white;
	cursor: pointer;
}

.selectedTopMenuItem {
	background: #BE2921;
	color: white;
	border: 1px solid #BE2921;
}

div.topMenuItem:hover {
	background: #BE2921;
	color: white;
	border: 1px solid #BE2921;
}


.link1:link {
    text-decoration: none;
    color: #455A64;
}

.link1:visited {
    text-decoration: none;
    color: #455A64;
}

.link1:hover {
    text-decoration: underline;
    color: #455A64;
}

.link1:active {
    text-decoration: underline;
	 color: #455A64;
}

.type-button {
	border: solid 2px Silver;
	margin: 10px;
	padding: 5px;
	cursor: pointer; 
}

.type-button:hover {
	border: solid 2px #455A64;
}


.user_input {
	font-family: Ubuntu, Arial;
	font-size: 12pt;
	width: 290px;
}


.narrow {
	display: block;
}

.wide {
	display: none;
}

@media (min-width: 766px) {
	.narrow {
		display: none;
	}

	.wide {
		display: block;
	}
}

.planet {
	display: inline-block;
	padding:0px 5px 6px 10px;
	cursor: pointer;
	vertical-align:middle;	
}

.redHand {
    background-image: url('/static/red-hand.jpg');
    background-repeat: no-repeat;
    background-position: center; 
	height: 523px;
	background-color:#B6271F;
	text-align:center;
}

table.price_table {
    border-collapse: separate;
    border-spacing: 10px;
    margin: -10px;
}


table.price_table td {
	background:white;
	border: solid 1px #69A2B3;
	height: 40px;
	width: 25%;
	padding: 10px;
	text-align:center;
	line-height: 1.2;
}


table.price_table_small {
    border-collapse: separate;
    border-spacing: 10px;
    margin: 0px;
}


table.price_table_small td {
	background:white;
	border: solid 1px #69A2B3;
	height: 50px;
	width: 50%;
	padding: 10px;
	text-align:center;
	line-height: 1.2;
}

table td.legend {
	text-align:left;
	background: #CEE6ED;
}

table td.price_header {
	font-weight: bold;
	font-size: 120%;
}

a.buy_button, a.buy_button:visited {
	font-weight: bold;
	font-size: 140%;
	color: white;
	text-decoration:none;
}

table td.no_color {
	background:none; 
	border:none;
	padding: 0px;
}


table td.current_cell {
	background:none;
	border: none;
	padding: 0px;
	text-align:center;
	height: 15px;
}

.active_plan {
	display: none;
}


.bbutton_core {
	margin:0px;
	border:none; 
	border-radius:5px;
	padding:0px;
	text-align:center;
	padding-top:30px;
	padding-bottom:30px;
}

.lang_list {
	display:inline-block;
	margin:0px;
	padding: 0px;
}

.lang_option {
	margin:5px;
	padding: 10px;
	cursor: pointer;
	color: #BE2921;
	background: white;
}

.lang_option:hover {
	color: white;
	background: #BE2921;
}


ul {
    list-style-type: disc;
    margin:10px;
    padding-left:30px;
}

ul li {
	display: list-item;
	line-height: 130%;
	text-align: justify;
}

ol {
    list-style-type: decimal;
    margin:10px;
    padding-left:30px;
}

ol li ol {
    list-style-type: lower-alpha;
}

ol li {
	display: list-item;
	line-height: 130%;
	text-align: justify;
}



</style>


</head>


<body>


<div id="wide" class="">
	
	<div id="topLine" style="height:52px; background:white;">
		
		<div class="center" style="max-width:768px;">
			<table style="width:100%;">
				<tr>
					<td width="52"><a href="/"><img width="66" height="66" src="/static/drakosha132.png" style="vertical-align: top;"></img></a></td>
					<td width="100%" style="text-align:right;"><h1 style="color:#BE2921; font-size:150%; font-weight:bold; margin:0px;">Drakon.Tech Terms of Service</h1></td>
				</tr>
			</table>
		</div>
	</div>	
	
	<div class="" style="background:white; padding-bottom:40px; padding-top:40px;">	
		<div class="center" style="max-width:768px;">
			<ol>
				<li>All you create with Drakon.Tech becomes your intellectual property.</li>
				<li>You promise not to attack or damage the Drakon.Tech services.</li>
				<li>You promise not to steal or destroy data that belongs to other users of Drakon.Tech.</li>
				<li>Drakon.Tech is provided with no warranty.</li>
				<li>Drakon.Tech uses cookies for the login mechanism, user settings, and gathering anonymous statistics.</li>
			</ol>	
		</div>
	</div>
</div>


</body>
</html>



