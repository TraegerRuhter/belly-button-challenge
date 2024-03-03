// Initialize the dashboard
function init() {
  // Select the dropdown element in the HTML
  let selector = d3.select("#selDataset");

  // Fetch the JSON data and execute the following function
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let sampleNames = data.names;

      // Populate the dropdown with sample names
      for (let i = 0; i < sampleNames.length; i++) {
          selector
              .append("option")
              .text(sampleNames[i])
              .property("value", sampleNames[i]);
      };

      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildPlots(firstSample);
      demoInfo(firstSample);
  });
}

// Function to build the plots
function buildPlots(sample) {
  // Fetch the JSON data for the plots
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      // Extract the data for the plots
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      // Build the Bar Chart
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      let barData = [
          {
              y: yticks,
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
          }
      ];

      let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          titlefont: { size: 18 },
          xaxis: { title: "Sample Values" },
          yaxis: { title: "OTU ID" },
          margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barData, barLayout);

      // Build the Bubble Chart
      let bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          titlefont: { size: 18 },
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30 }
      };
      let bubbleData = [
          {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                  size: sample_values,
                  color: otu_ids,
                  colorscale: "Earth"
              }
          }
      ];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}

// Function to display the demographic info
function demoInfo(sample) {
  // Fetch the JSON data for the demographic info
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;

      // Filter the data for the object with the desired sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];

      // Select the panel for demographic information
      let PANEL = d3.select("#sample-metadata");
      PANEL.html("");

      // Display each key-value pair from the metadata JSON object
      for (key in result) {
          PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
      };

  });
}

// Function called by DOM changes
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildPlots(newSample);
  demoInfo(newSample);
}

// Initialize the dashboard
init();