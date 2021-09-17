var names = [];
var metadata = [];
var samples = [];

function init() {
    d3.json("/samples.json").then(function(data) {

        // Store all the names in a variable
        names = data.names
        console.log(data.samples)
        // Select the drop down dataset
        var dropDown = d3.select("#selDataset");

        // Loop through each name and append it to the drop down, giving text and value
        for(let i = 0; i < names.length; i++){
            dropDown.append("option").text(names[i]).property("value", names[i]);
        };
      });

      // Run the 3 functions to show the first item by default
      demographicInfo(940);
      hBarChart(940);
      bubbleChart(940);
}

// Writing our function to run the 3 functions below with what option the user picked in the dropdown
function optionChanged(choice){
    demographicInfo(choice);
    hBarChart(choice);
    bubbleChart(choice);
};

function demographicInfo(choice){
    //Read in our JSON File
    d3.json("/samples.json").then(function(data) {

        //Store the metadata in a variable
        metadata = data.metadata;

        // Filter the metadata to find the object with choice ID
        var filMeta = metadata.filter(function(f){return f.id == choice});
        var filChoice = filMeta[0];

        // Finding the Demographic Info DIV and selecting it
        var demoDiv = d3.select("#sample-metadata");

        // Resetting the html to "" so its empty upon selection
        demoDiv.html("");

        // For each row in the dictionary, we append a paragraph of html of the key and value
        Object.entries(filChoice).forEach(function([key, value]){
            return demoDiv.append("p").text(`${key}: ${value}`)

        });
    });
}

function hBarChart(choice){
    //Read in our JSON File
    d3.json("/samples.json").then(function(data) {
        samples = data.samples;

        // Filter the metadata to find the object with choice ID
        var filSample = samples.filter(function(f){return f.id == choice});
        var filSampleChoice = filSample[0];

        //console.log(filSampleChoice);

        // Store the OTU Id's in a variable
        var o_id = filSampleChoice.otu_ids;

        // Turn each item in the array into a string adding "OTU"
        for (let i = 0; i < o_id.length; i++){
            o_id[i] = "OTU " + o_id[i]
        }
        // Storing labels and sample values into variables
        var o_label = filSampleChoice.otu_labels;
        var samp_values = filSampleChoice.sample_values;

        // This is where we create our trace for the graph
        var trace1 = {
            x: samp_values.slice(0,10).reverse(),
            y: o_id.slice(0,10).reverse(),
            text: o_label.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        }
        // Create the data object for plotly
        var graph_data = [trace1];

        // Create the graph
        Plotly.newPlot("bar", graph_data);


    });
};

function bubbleChart(choice){
    //Read in our JSON File
    d3.json("/samples.json").then(function(data) {
        samples = data.samples;

        // Filter the metadata to find the object with choice ID
        var filSample = samples.filter(function(f){return f.id == choice});
        var filSampleChoice = filSample[0];

        //console.log(filSampleChoice);

        // Store the OTU Id's in a variable
        var o_id = filSampleChoice.otu_ids;

        // Storing labels and sample values into variables
        var o_label = filSampleChoice.otu_labels;
        var samp_values = filSampleChoice.sample_values;

        // This is where we create our trace for the graph
        var trace2 = {
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
        var graph2_data = [trace2];

        // Create the graph
        Plotly.newPlot("bubble", graph2_data);

    });
};


init();

