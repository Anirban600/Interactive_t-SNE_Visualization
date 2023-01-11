var width = document.documentElement.clientWidth * 0.6;
var height = document.documentElement.clientHeight * 0.7;

var origin = [width / 2, height / 2];
var scale = 12;
var beta = 0;
var alpha = 0;
var pointer_size = 4;
var startAngle = Math.PI / 4;
var semaphore = true;

var svg = d3
  .select("svg")
  .call(d3.drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd))
  .append("g");

// var color = d3.scaleOrdinal(d3.schemeCategory20);
var color = ["#fff100", "#ff8c00", "#e81123", "#ec008c", "#68217a",
             "#00188f", "#00bcf2", "#00b294", "#009e49", "#bad80a"];

// Randomize the colors
// color = color.sort(()=>Math.random()-0.5);

var mx, my, mouseX, mouseY;

var point3d = d3
  ._3d()
  .x((data) => data.x)
  .y((data) => data.y)
  .z((data) => data.z)
  .origin(origin)
  .rotateY(startAngle)
  .rotateX(-startAngle)
  .scale(scale);

var div_tool = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var div_detail = d3
  .select("body")
  .append("div")
  .attr("class", "popup")
  .style("transform", "scale(0)");

var blur_view = d3
  .select("body")
  .append("div")
  .attr("class", "blur-view");

function CreateScatter(data) {
  var points = svg.selectAll("circle").data(data, (data) => data.id);

  points
    .enter()
    .append("circle")
    .attr("class", "_3d")
    .attr("cx", (data) => data.projected.x)
    .attr("cy", (data) => data.projected.y)
    .merge(points)
    .attr("r", pointer_size)
    .attr("fill", (data) => color[parseInt(data.label)])
    .attr("opacity", 1)
    .on("mouseover", function (data) {
      div_tool.transition().duration(10).style("opacity", 1);
      div_tool
        .html('<img src="' + data.path + '" width="30"/>')
        .style("left", d3.event.pageX + 8 + "px")
        .style("top", d3.event.pageY + 14 + "px")
        .style("font-color", "white");
    })
    .on("mouseout", function (d) {
      div_tool.transition().duration(250).style("opacity", 0);
    })
    .on("click", (data) => onClick(data));
}

function onClick(d) {
  semaphore = true;
  document.getElementById("id-input").innerText = d.id + "";
  let content = '<div class="more-details" style="left:' + d3.event.pageX + 'px; top:' + d3.event.pageY + 'px;">' +
          '<img class="inner" id="inner-0" src="' + d.path + '">' +
          '<span class="s-inner" id="s-inner-0">' + d.label + '</span>' +
          '<img class="inner" id="inner-1" src="">' +
          '<span class="s-inner" id="s-inner-1"></span>' +
          '<img class="inner" id="inner-2" src="">' +
          '<span class="s-inner" id="s-inner-2"></span>' +
          '<img class="inner" id="inner-3" src="">' +
          '<span class="s-inner" id="s-inner-3"></span>' +
          '<img class="inner" id="inner-4" src="">' +
          '<span class="s-inner" id="s-inner-4"></span>' +
      '</div>';
  
  div_detail
    .html(content)
    .style("transform-origin", d3.event.pageX + "px " + d3.event.pageY + "px")
    .style("transform", "scale(1)");
    
    blur_view.style("backdrop-filter", "blur(15px)");
    blur_view.style("z-index", "9");
}

function UpdateScatter() {
  svg
    .selectAll("circle")
    .attr("cx", (data) => data.projected.x)
    .attr("cy", (data) => data.projected.y);
}

function dragStart() {
  mx = d3.event.x;
  my = d3.event.y;
}

function dragged() {
  mouseX = mouseX || 0;
  mouseY = mouseY || 0;
  beta = ((d3.event.x - mx + mouseX) * Math.PI) / 230;
  alpha = (((d3.event.y - my + mouseY) * Math.PI) / 230) * -1;
  point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(my_data);
  UpdateScatter();
}

function dragEnd() {
  mouseX = d3.event.x - mx + mouseX;
  mouseY = d3.event.y - my + mouseY;
}

function zoom(event) {
  var y = event.deltaY;
  scale -= y * 0.01;
  if (scale < 4.0) scale = 4.0;
  else if (scale > 40.0) scale = 40.0;
  else {
    point3d.scale(scale)(my_data);
    UpdateScatter();
  }
}

var my_data = JSON.parse(data);
var data = point3d(my_data);
CreateScatter(data);


function changeTheme() {
  document.body.classList.toggle('dark-theme');
  var icon = document.getElementById('theme-icon');
  if (icon.classList.contains('fa-moon')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
  else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

function reset() {
  scale = 12;
  beta = 0;
  alpha = 0;
  pointer_size = 4;
  startAngle = Math.PI / 4;
  mx = 0, my = 0, mouseX = 0, mouseY = 0;
  point3d
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale)(my_data);
  UpdateScatter();
}

function clear_click() {
  if (semaphore) semaphore = false;
  else {
    div_detail.style("transform", "scale(0)");
    blur_view.style("backdrop-filter", "blur(0px)");
    blur_view.style("z-index", "-100");
  }
}

function show_info(){
  document.getElementById("info-page").style.transform = " translateY(0)";
}

function hide_info(){
  document.getElementById("info-page").style.transform = " translateY(-100vh)";
}

function changeSize(val){
  pointer_size = val;
  svg.selectAll("circle").attr("r", pointer_size);
}

function fill_legend(){
  var box = document.getElementById("legand");
  for(let i = 0; i < 10; i++){
    let container = document.createElement("div");
    container.className = "container";
    let color_div = document.createElement("div");
    color_div.className = "color-div";
    color_div.style.backgroundColor = color[i];
    let label_div = document.createElement("div");
    label_div.className = "label-div";
    label_div.innerText = i + "";
    container.appendChild(color_div);
    container.appendChild(label_div);
    box.appendChild(container);
  }
}

fill_legend();