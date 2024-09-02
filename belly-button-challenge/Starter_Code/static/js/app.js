function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let metadata = data.metadata;

    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let samples = data.samples;

    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      margin: { t: 30 }
    };
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    let barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    let barLayout = {
      title: 'Top 10 Bacteria Clututres Found',
      margin: { t: 30, l: 150 },
      xaxis: { title: 'Number of Bacteria' }
    };

    Plotly.newPlot('bar', barData, barLayout);
  });
}

function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let sampleNames = data.names;

    let dropdown = d3.select("#selDataset");

    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    let firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();