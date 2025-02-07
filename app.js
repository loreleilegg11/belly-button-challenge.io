// function that populates the metadata
function demoInfo(sample) {
   // console.log(sample);

    // use d3.json to get the data
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // grab metadata
        let metaData = data.metadata;
        
        // filter based on the value of the sample (only 1 result in an array)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        
        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        // clear to then run another
        d3.select("#sample-metadata").html("");

        // use object.entries to get value/key pairs
        Object.entries(resultData).forEach(([key, value]) => { // Corrected this line
            // d3.select to add data 
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

///  building graph 
function buildBarChart(sample)
{

   // console.log(sample);
   //let data =  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
   // console.log(data);
    
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // grab sample data 
        let sampleData = data.samples;
        //console.log(sampleData);
     
        // filter based on the value of the sample (only 1 result in an array)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        // get otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
       // console.log(otu_labels);
       // console.log(sample_values);

        // build the bar chart
        // yticks, xvalues and text labels and use slice to get top 10
        let yticks = otu_ids.slice(0,10).map(id=> `OTU ${id}`);
        let XValues = sample_values.slice(0,10);
        let Text_labels = otu_labels.slice(0,10);
        //console.log(Text_labels)

        let barChart = {
            y: yticks.reverse(),
            x: XValues.reverse(),
            text: Text_labels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: { title: "Number of Bacteria" },

        };

        Plotly.newPlot("bar", [barChart], layout)

    });


}

// function that builds the bubble chart 
function buildBubbleChart(sample)
{
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // grab sample data 
        let sampleData = data.samples;
        //console.log(sampleData);
     
        // filter based on the value of the sample (only 1 result in an array)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        // get otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
       // console.log(otu_labels);
       // console.log(sample_values);

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
            
         }

         let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            yaxis:{ title: "Number of Bacteria" }
        };

        Plotly.newPlot("bubble", [bubbleChart], layout)
       

    });


}


// function intializes dashboard
function initialize() 
{
    //let data = d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
    //console.log(data);
    
    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use d3.json to get data
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        let sampleNames = data.names;
        //console.log(sampleNames);

        // create option for each sample using forEach
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value",sample);
        });

         // pass in the information for first sample
        let sample1 = sampleNames[0];

        // call the function to build metadata
        demoInfo(sample1);

        // call function to build bar chart
        buildBarChart(sample1);

        // call function to build bubble chart
        buildBubbleChart(sample1)
    });

    
}

// function updates dashboard
function optionChanged(item)
{
    // use metadata
    demoInfo(item);

    // call fucntion to build bar chat
    buildBarChart(item);

    // call  function to build bubble chart
    buildBubbleChart(item);
}

initialize();