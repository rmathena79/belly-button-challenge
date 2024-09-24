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
      let description = `${key.toUpperCase()}: ${metadatum[key]}`;
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

    console.log(`OTU IDs: ${otu_ids}`);
    console.log(`OTU Labels: ${otu_labels}`);
    console.log(`Sample Values: ${sample_values}`);

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids        
      }
    };
    
    let bubbleData = [bubbleTrace];
    
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      showlegend: false,
      height: 600,
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const BAR_COUNT = 10;
    otu_id_strs = otu_ids.slice(0,BAR_COUNT).map(x => `OTU ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0,BAR_COUNT).reverse(),
      y: otu_id_strs.reverse(),
      type: 'bar',
      text: otu_labels.slice(0,BAR_COUNT).reverse(),
      orientation: 'h'
    };
    
    let barData = [barTrace];
    
    let barLayout = {
      title: `Top ${BAR_COUNT} Bacteria Cultures Found`,
      showlegend: false,
      xaxis: {
        title: 'Number of Bacteria'
      },
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
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
