let names = [];
let metadata = [];
let samples = [];

function init() {
    d3.json("samples.json").then(function(data) {

        // Store all the names in a letiable
        names = data.names;
        metadata= data.metadata;
        samples = data.samples;
        //console.log(data.metadata)

        // Select the drop down dataset
        let dropDown = d3.select("#selDataset");

        // Loop through each name and append it to the drop down, giving text and value
        names.forEach(function(name){
            dropDown.append("option").text(name).property("value", name);
        });

       });

      // Run the 3 functions to show the first item by default
      let defaultSelection = parseInt(names[0]);
      demographicInfo(940);
      hBarChart(940);
      bubbleChart(940);
      gaugeChart(940);
}

// Writing our function to run the 3 functions below with what option the user picked in the dropdown
function optionChanged(choice){
    demographicInfo(choice);
    hBarChart(choice);
    bubbleChart(choice);
    gaugeChart(choice);
};

// Function to update the demographic info table
function demographicInfo(choice){
    //Read in our JSON File
    d3.json("samples.json").then(function(data) {

        //Store the metadata in a letiable
        metadata = data.metadata;

        // Filter the metadata to find the object with choice ID
        let filMeta = metadata.filter(function(f){return f.id == choice});
        let filChoice = filMeta[0];

        // Finding the Demographic Info DIV and selecting it
        let demoDiv = d3.select("#sample-metadata");

        // Resetting the html to "" so its empty upon selection
        demoDiv.html("");

        // For each row in the dictionary, we append a paragraph of html of the key and value
        Object.entries(filChoice).forEach(function([key, value]){return demoDiv.append("p").text(`${key}: ${value}`)
        });
    });
}
// Function to make the horizontal bar chart
function hBarChart(choice){
    //Read in our JSON File
    d3.json("samples.json").then(function(data) {
        samples = data.samples;

        // Filter the metadata to find the object with choice ID
        let filSample = samples.filter(function(f){return f.id == choice});
        let filSampleChoice = filSample[0];

        //console.log(filSampleChoice);

        // Store the OTU Id's in a letiable
        let o_id = filSampleChoice.otu_ids;

        // Turn each item in the array into a string adding "OTU"
        for (let i = 0; i < o_id.length; i++){
            o_id[i] = "OTU " + o_id[i]
        }

        // Storing labels and sample values into letiables
        let o_label = filSampleChoice.otu_labels;
        let samp_values = filSampleChoice.sample_values;

        // This is where we create our trace for the graph
        let trace1 = {
            x: samp_values.slice(0,10).reverse(),
            y: o_id.slice(0,10).reverse(),
            text: o_label.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        }
        // Create the data object for plotly
        let graph_data = [trace1];

        // Create the graph
        Plotly.newPlot("bar", graph_data);


    });
};

// Function to make the bubble chart
function bubbleChart(choice){
    //Read in our JSON File
    d3.json("samples.json").then(function(data) {
        samples = data.samples;

        // Filter the metadata to find the object with choice ID
        let filSample = samples.filter(function(f){return f.id == choice});
        let filSampleChoice = filSample[0];

        //console.log(filSampleChoice);

        // Store the OTU Id's in a letiable
        let o_id = filSampleChoice.otu_ids;

        // Storing labels and sample values into letiables
        let o_label = filSampleChoice.otu_labels;
        let samp_values = filSampleChoice.sample_values;

        // This is where we create our trace for the graph
        let trace2 = {
            x: o_id,
            y: samp_values,
            text: o_label,
            mode: "markers",
            marker:{
                color: o_id,
                size: samp_values
            }
        }

        // Create the data object for plotly
        let graph2_data = [trace2];

        // Create the graph
        Plotly.newPlot("bubble", graph2_data);

    });
};

// Function to make the gauge chart
function gaugeChart(choice){
    //Read in our JSON File
    d3.json("samples.json").then(function(data) {

        //Store the metadata in a letiable
        metadata = data.metadata;

        // Filter the metadata to find the object with choice ID
        let filMeta = metadata.filter(function(f){return f.id == choice});
        let filChoice = filMeta[0];

        // Pulling out the wfreq item in the object
        let washFreq = filChoice.wfreq;

        // This is where we create our trace for the graph
        let trace3 = {
            value: washFreq,
            title: {
                text: "Belly Button Washing Frequency" 
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9], dtick: 1},
                bar: { color: "black" },
                steps: [
                        { range: [0, 1], color: "#f2f2f2"},
                        { range: [1, 2], color: "#e5f2e5"},
                        { range: [2, 3], color: "#cce5cc"},
                        { range: [3, 4], color: "#b2d8b2"},
                        { range: [4, 5], color: "#99cc99"},
                        { range: [5, 6], color: "#7fbf7f"},
                        { range: [6, 7], color: "#66b266"},
                        { range: [7, 8], color: "#4ca64c"},
                        { range: [8, 9], color: "#329932"}
                        ]
                    }
        }

        // Create the data object for plotly
        let graph3_data = [trace3];

        // Create the graph
        Plotly.newPlot('gauge', graph3_data);
    });
}

//Run Init
init();