/* jshint browser: true */
/* boss: true */
/*global
alert, confirm, console, Debug, opera, prompt, WSH, FileReader, escape:true
*/


function splitStrings(raw_input, count) {
    "use strict";
    var raw_data = raw_input,
        i,
        j,
        k = 0,
        seqn_len,
        ch,
        ch_data,
        processed_input = [];
        
    for (i = 0; i < count; i += 1) {
        if (raw_data[i].charAt(0) === '>') {
            if (!processed_input[i]) { processed_input[i] = []; }
            ch = raw_data[i];
            ch_data = ch.split(" ");
            processed_input[i] = ch_data[0].slice(1, parseInt(ch_data[0].length, 10));
        } else {
            if (raw_data !== null) {
                if (!processed_input[i]) { processed_input[i] = []; }
                seqn_len = raw_data[i].length;
                ch = raw_data[i];
                ch_data = ch.split("");
                for (j = 0; j < seqn_len; j += 1) {
                    processed_input[i][j] = ch_data[j];
                }
            }
        }
    }
    return processed_input;
}

function mutSeq(pass_unid, pass_seq, pass_num, n) {
    "use strict";
    var seqlen = pass_seq.length,
        j,
        i,
        num = pass_num,
        seq = pass_seq,
        uid = pass_unid,
        statTable = "",
        local;
    statTable = statTable + "<table  class='sqnTable' ><tr><th colspan = " + seqlen + " style {text-align:left;}> Mutation Statistics </th></tr><tr>";
    for (i = 0; i < seqlen; i += 1) {
        if (seq[j] === "") { statTable = statTable + "<td id='charTable' title='" + i + "'> No Mutations occured for this character! </td></tr>"; }
        statTable = statTable + "<th id='charTable' title='" + uid[i] + "'>" + num[i] + "</th>";
    }
    statTable = statTable + "</tr><tr>";
    for (i = 0; i < seqlen; i += 1) {
        statTable = statTable + "<td><table>";
        for (j = 0; j < seq[i].length; j += 1) {
            local = j + 1;
            if (n === j) {
                statTable = statTable + "<tr><td  id = 'co-relate' style {text-align:center;} title='Character Position : " + local + "'>" + seq[i][j] + "</td></tr>";
            } else {
                statTable = statTable + "<tr><td  style {text-align:center;} title='Character Position : " + local + "'>" + seq[i][j] + "</td></tr>";
            }
        }
        statTable = statTable + "</table></td>";
    }
    statTable = statTable + "</tr></table>";
    document.getElementById('left_div').innerHTML = statTable;
    window.location.hash = '#co-relate';
}
    
function mutatedSeq(pass_seq, p, node, primary_seq) {
    "use strict";
    //this.$document.getElementById('idTable').style.background = "#9d9d9d";
    var i,
        seq = pass_seq,
        seqTable = "",
        k,
        seq_br,
        j;
    j = document.getElementsByClassName("on");
    for (i = 0; i < j.length; i += 1) {
        j[i].className = "";
    }
    node.className = "on";
    
    
    seqTable = seqTable + "<table  class='sqnTable' ><tr><th colspan = " + seq.length + "> Mutated Sequence </th></tr><tr><td>" + 1 + "</td>";
    for (j = 0; j < seq.length; j += 1) {
        k = j + 1;
        seq_br = j % 50;
        if (seq_br === 0 && j !== 0) { seqTable = seqTable + "<td>" + j + "</td></tr><tr><td>" + k + "</td>"; }
        if (primary_seq[j] !== seq[j]) {
            seqTable = seqTable + "<td class='mutchar' title='" + k + " ' style{ text-align:center;}>" + seq[j] + "</td>";
        } else {
            seqTable = seqTable + "<td id='Table' title='" + k + " ' style{ text-align:center;}>" + seq[j] + "</td>";
        }
    }
    seqTable = seqTable + "</tr></table>";
    document.getElementById('mutseq_div').innerHTML = seqTable;
    window.location.hash = '#mutseq_div';
}

function compSeq(temp_seq, count, temp_unid) {
    "use strict";
    var sequence = temp_seq,
        unid = temp_unid,
        n = count,
        counter = 0,
        grouping_seq = [],
        grouped_seq = [],
        grouping_unid = [],
        grouped_unid = [],
        num = [],
        grouped_num = [],
        i = 1,
        j,
        len = sequence[i].length,
        seq_stat = [];
    for (j = 0; j < len; j += 1) {
        if (seq_stat[j] === null) { seq_stat[j] = 0; }
        for (i = 1; i < n; i += 1) {
            if (sequence[0][j] !== sequence[i][j]) {
                if (!grouping_seq[counter]) { grouping_seq[counter] = []; }
                if (!grouping_unid[counter]) { grouping_unid[counter] = []; }
                if (!num[counter]) { num[counter] = []; }
                grouping_seq[counter] = grouping_seq[counter].concat(sequence[i]);
                grouping_unid[counter] = grouping_unid[counter].concat(unid[i]);
                num[counter] = num[counter].concat(i);
                counter = counter + 1;
                
            }
        }
        seq_stat[j] = counter;
        grouped_seq[j] = grouping_seq;
        grouped_unid[j] = grouping_unid;
        grouped_num[j] = num;
        num = [];
        grouping_seq = [];
        grouping_unid = [];
        counter = 0;
    }
    //document.getElementById('left_div').innerHTML = grouped_num[j - 1];
    return [seq_stat, grouped_seq, grouped_unid, grouped_num];
}

function graphP(temp_stat, temp_primary_seq, count) {
    "use strict";
    var stat = temp_stat,
        primary_seq = temp_primary_seq,
        data,
        layout,
        trace1,
        trace2,
        rslt,
        selectorOptions,
        x1 = [],
        y1 = [],
        x2 = [],
        y2 = [],
        i;
    for (i = 1; i <= stat.length; i += 1) {
        y1.push(stat[i - 1]);
        x1.push(i);
        y2.push(((stat[i - 1] / count) * 100).toFixed(2));
        x2.push(i);
    }
    
    selectorOptions = {
        buttons: {
            step: 'unit',
            stepmode: 'backward',
            count: 1,
            label: '10'
        }
    };
    trace1 = {
        x: x1,
        y: y1,
        name: "#Mutations",
        marker: {color: "rgb(255, 153, 102)",
                thickness: 60},
        type: "bar"
    };
    trace2 = {
        x: x2,
        y: y2,
        text: primary_seq,
        name: "Probability %",
        marker: {color: "rgb(55, 83, 109)",
                thickness: 60},
        type: "bar"
    };
    data = [trace1, trace2];
    layout = {
        title: "Statistics of mutations",
        barmode: "stack",
        xaxis: {
            tickfont: {
                size: 14,
                color: "rgb(107, 107, 107)"
            },
            rangeselector: selectorOptions,
            rangeslider: {},
            bargap: 0
        },
        yaxis: {
            title: "Total Number of Mutations",
            titlefont: {
                size: 16,
                color: "rgb(107, 107, 107)"
            },
            tickfont: {
                size: 14,
                color: "rgb(107, 107, 107)"
            },
            fixedrange : true
        },
        legend: {
            xanchor: "left",
            yanchor: "top",
            y: 1.5,
            x: -0.05,
            bgcolor: "rgba(255, 255, 255, 0)",
            bordercolor: "rgba(255, 255, 255, 0)"
        },
        bargap: 0.05
    };
    Plotly.newPlot('graph_div', data, layout);
}

function bubbleP(seq, count) {
    "use strict";
    var i = 1,
        j,
        k,
        temp = 0,
        counter,
        bubble = [],
        len,
        data,
        trace,
        x = new Array(395),
        y = new Array(395),
        layout,
        graphDiv = "",
        bubbleTable = "";
    for (i = 1; i < count; i += 1) {
        k = i - 1;
        counter = 0;
        len = seq[i].length;
        if (!bubble[k]) { bubble[k] = []; }
        for (j = 0; j < len; j += 1) {
            if (seq[0][j] !== seq[i][j]) {
                //counter = counter + 1;
                if (i === 1) {
                    bubble[k][j] = counter + 1;
                } else {
                    for (temp = 0; temp <= i; temp += 1) {
                        if (seq[i][j] === seq[temp][j]) {
                            counter = counter + 1;
                            bubble[k][j] =  counter;
                        } else { bubble[k][j] = counter;  }
                    }
                }
            } else { bubble[k][j] = counter; }
            counter = 0;
        }
    }
    //document.getElementById("bubble_div").innerHTML = bubble;
    bubbleTable = bubbleTable + "<table  class='sqnTable' ><tr><th colspan = " + bubble[0].length + "> Mutation Statistics </th></tr>";
    for (i = 0; i < count - 2; i += 1) {
        bubbleTable = bubbleTable + "<tr>";
        for (j = 0; j < bubble[i].length; j += 1) {
            k = j + 1;
            bubbleTable = bubbleTable + "<td id='charTable' title='" + k + "'>" + bubble[i][j] + "</td>";
        }
        bubbleTable = bubbleTable + "</tr>";
    }
    bubbleTable = bubbleTable + "</table>";
    //document.getElementById("bubble_div").innerHTML = bubbleTable;
    for (i = 0; i < count - 2; i += 1) {
        for (j = 0; j < bubble[i].length; j += 1) {
            x[j] = bubble[i][j];
            y[j] = i;
        }
    }
    trace = {
        x: x,
        y: y,
        mode: 'markers',
        name: 'points',
        marker: {
            color: 'rgb(102,0,0)',
            size: 2,
            opacity: [0.6]
        },
        type: 'scatter'
    };
        
    data = [trace];

    layout = {
        sizemode: 'area',
        size: x,
        sizeref: 2e5,
        showlegend: false
    };

    Plotly.newPlot("bubble_div", data, layout);
    //document.getElementById('bubble_div').innerHTML = graphDiv;
}


function toDisplay(fnl_seq, seq_names, total_seq) {
    "use strict";
    var processed_seq = fnl_seq,
        headers_seq = seq_names,
        count = total_seq,
        primary_seq,
        char_count,
        result_seq,
        seqTable = "",
        idTable = "",
        getI,
        i = 0,
        j,
		k,
        myJSON,
        myJSON1,
        num,
        rt_compSeq,
        grouped_seq,
        grouped_unid,
        grouped_num,
        stat,
        statTable = "",
        seq_br,
        result_headers;
    
    
    
    result_seq = splitStrings(processed_seq, count);
    primary_seq = result_seq[0];
    result_headers = splitStrings(headers_seq, count);
    rt_compSeq = compSeq(result_seq, count, result_headers);
    stat = rt_compSeq[0];
    grouped_seq = rt_compSeq[1];
    grouped_unid = rt_compSeq[2];
    grouped_num = rt_compSeq[3];
    
    
    seqTable = seqTable + "<table  class='sqnTable' ><tr><th colspan = " + parseInt(primary_seq.length, 10) + "> Sequence </th></tr><tr><td>" + 1 + "</td>";
    for (j = 0; j < parseInt(primary_seq.length, 10); j += 1) {
        k = j + 1;
        seq_br = j % 50;
        if (seq_br === 0 && j !== 0) { seqTable = seqTable + "<td>" + j + "</td></tr><tr><td>" + k + "</td>"; }
        myJSON1 = '';
        myJSON1 = JSON.stringify(grouped_seq[j]);
        myJSON = '';
        myJSON = JSON.stringify(grouped_unid[j]);
        num = '';
        num = JSON.stringify(grouped_num[j]);
        seqTable = seqTable + "<td id='charTable' title='Character Position : " + k + "\nProbability % : " + ((stat[j] / count) * 100).toFixed(3) + "\nNo. of Mutations : " + stat[j] + " ' onclick='mutSeq(" + myJSON + "," + myJSON1 + "," + num + "," + j + ")';>" + primary_seq[j] + "</td>";
    }
    
    
    idTable = idTable + "<table  class='idTable' ><tr><th colspan = " + parseInt(result_headers[i].length, 10) + "> Unique Id </th></tr><tr><td>" + 1 + "</td>";
    for (j = 0; j < count - 1; j += 1) {
        k = j + 1;
        seq_br = j % 10;
        if (seq_br === 0 && j !== 0) { idTable = idTable + "<td>" + j + "</td></tr><tr><td>" + k + "</td>"; }
        myJSON = '';
        myJSON = JSON.stringify(result_seq[k]);
        myJSON1 = '';
        myJSON1 = JSON.stringify(result_seq[0]);
        idTable = idTable + "<td id='idTable' classname='on' title='" + k + " ' onclick='mutatedSeq(" + myJSON + " ," + k + ",this," + myJSON1 + ")';>" + result_headers[k] + "</td>";
    }
    idTable = idTable + "</tr></table>";
    
    
    statTable = statTable + "<table  class='sqnTable' ><tr><th colspan = " + parseInt(stat.length, 10) + "> Mutation Statistics </th></tr><tr><td>" + 1 + "</td>";
    for (j = 0; j < parseInt(stat.length, 10); j += 1) {
        k = j + 1;
        seq_br = j % 50;
        if (seq_br === 0 && j !== 0) { statTable = statTable + "<td>" + j + "</td></tr><tr><td>" + k + "</td>"; }
        statTable = statTable + "<td id='charTable' title='" + k + "'>" + stat[j] + "</td>";
    }
    statTable = statTable + "</tr></table>";
    
    
    document.getElementById('seq_id').innerHTML = idTable;
    document.getElementById('seq_byte').innerHTML = seqTable;
    document.getElementById('count_div').innerHTML = count;
    //document.getElementById('test_div').innerHTML = statTable;
    graphP(stat, primary_seq, count);
    bubbleP(result_seq, count);
    //document.getElementById('test_div').innerHTML = grouped[2];
    
    
}





function readBlob(opt_startByte, opt_stopByte) {
    "use strict";
    var files = document.getElementById('files').files,
        file = files[0],
        start = parseInt(opt_startByte, 10) || 0,
        stop = parseInt(opt_stopByte, 10) || file.size - 1,
        seq,
        fw_seq,
        seqn,
        blob,
        totalseq,
        processingSeq,
        finalseq = new Array(200).join('.').split('.'),
        names = [],
        reader = new FileReader();
    
    if (!files.length) {
        alert('Please select a file!');
        return;
    }
    processingSeq = function (fw_seq) {
        //document.getElementById('test_div1').innerHTML = fw_seq;
        seq = fw_seq;
        seq = seq.trim();
        seqn = seq.split("\n");
        totalseq = parseInt(seqn.length, 10);
        var j = 0, i = 0, header_length;
        for (i =  0; i < totalseq; i += 1) {
            if (seqn[i].charAt(0) === '>') {
                //remove one line,starting at the first position
                if (i !==  0) {j += 1; } else {j = 0; }
                names[j] = seqn[i].slice(0, parseInt(seqn[i].length, 10));
            } else {
                finalseq[j] = finalseq[j].concat(seqn[i]);
            }
        }
        header_length = parseInt(names.length, 10);
        toDisplay(finalseq, names, header_length);
    };
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
            fw_seq = evt.target.result;
            processingSeq(fw_seq);
        }
    };
    blob = file.slice(start, stop + 1);
    reader.readAsText(blob);
    //document.getElementById('test_div1').innerHTML = stop;
    document.getElementById('byte_range').textContent = ['Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file'].join('');
}


function startBtn() {
    "use strict";
    document.querySelector('.readBytesButtons').addEventListener('click', function (evt) {
        if (evt.target.tagName.toLowerCase() === 'button') {
            var startByte = evt.target.getAttribute('data-startbyte'),
                endByte = evt.target.getAttribute('data-endbyte');
            readBlob(startByte, endByte);
        }
    }, false);
}






   
/*

}*/