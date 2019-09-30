var colors = ['#D81B60', '#1E88E5', '#FFC107', '#004D40'];

/*
this is the util for the color palette. it return a array of colors for a definded size
*/
export default function color(size) {
  var result = [];
  for (var i = 0; i < size; i++) {
    result.push(colors[i % 4]);


  }
  if ((size % 4) == 1) {
    result.pop();
    result.push(colors[1]);

  }

  //if only 1 elment in the chart, then use the color yellow (i like yellow)
  if (size == 1) {
    result = [];
    result.push(colors[2]);
    return result;
  }
  return result;
}
