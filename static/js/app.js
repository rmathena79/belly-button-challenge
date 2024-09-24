// Build the metadata panel
function buildMetadata(sampleID) {
  console.log(`Building metadata for sample ${sampleID}`);
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadatum = metadata.filter(x => x.id == sampleID)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.selectAll("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.keys(metadatum).forEach(key => {
      let description = `${key}: ${metadatum[key]}`;
      console.log(description);
      panel.append("p").text(description);
    });
  });
}

// function to build both charts
function buildCharts(sampleID) {
  console.log(`Building charts for sample ${sampleID}`);
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample = samples.filter(x => x.id == sampleID)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample.otu_ids;
    let otu_labels = sample.otu_labels;
    let sample_values = sample.sample_values;

    // Build a Bubble Chart
    console.log(`OTU IDs: ${otu_ids}`);
    console.log(`OTU Labels: ${otu_labels}`);
    console.log(`Sample Values: ${sample_values}`);

    // Render the Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids        
      }
    };
    
    var bubbleData = [trace1];
    
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false,
      height: 600,
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log(`names: ${names}`);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.selectAll("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });      
      
    // Get the first sample from the list
    let samples = data.samples;
    let sampleID = samples[0].id;

    // Build charts and metadata panel with the first sample
    buildCharts(sampleID);
    buildMetadata(sampleID);
  });
}

// Function for event listener
function optionChanged(newSampleID) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(`New sample: ${newSampleID}`);
  buildCharts(newSampleID);
  buildMetadata(newSampleID);
}

// Initialize the dashboard
init();
