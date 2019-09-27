import Service from '@ember/service';

export default Service.extend({

  content: {
    widgetName: '',
    picturesrc: '',
    content: '',
    motivation: ''
  },

  setWidget(name) {
    var con = "";

    if (name === "activeclassinstances") {
       con = {
        widgetName: 'Active class instances',
        picturesrc: 'assets/images/activeclassinstances_info.jpg',
        content: "This Widget visualizes the instantiated classes inside a software landscape. It shows how often a class is instantiated. The visualisation is in form of a pie chart and it starts with the highest instantiated class. This widget only shows the newest landscape thats comming inside explor viz.",
        motivation: "You can detect inside your software, if your programm do unexpected things like instantiate a bunch of classes."
      };
      this.setContent(con);
    }

    if (name === "programminglanguagesoccurrence") {

       con = {
        widgetName: 'Programming languages occurrence',
        picturesrc: 'assets/images/programminglanguagesoccurrence_info.jpg',
        content: "This widget shows which programming languages are used inside your software. The widget only shows the data of the newest landscape.",
        motivation: "Inside of very large project with multiple people, you can loose very fast the overview. If someone starts using different languages on specific components, you can see it inside this widget very fast."
      };
      this.setContent(con);
    }

    if (name === "totaloverviewwidget") {
       con = {
        widgetName: 'Total overview',
        picturesrc: 'assets/images/totaloverview_info.jpg',
        content: "This widget gives u an overview over the landscape. It shows you how many systems, nodes and applikations are currently in the newest landscape available.",
        motivation: "Inside of very large project , you can loose very fast the overview. This widget is simple and just shows you the total amount of the different components, to get a fast overview how complex the project is at the current state."
      };
      this.setContent(con);
    }

    if (name === "totalrequests2") {
       con = {
        widgetName: 'Total requests',
        picturesrc: 'assets/images/totalrequests_info.jpg',
        content: "This widget shows the total requests inside a landscape. It shows the data inside a line chart with previous landscapes.",
        motivation: "If you see on a specific landscape a very high number of requests, then you can go inside the replay mode of explor viz, to try to find out what is happening there and maybe fix you application after."
      };
      this.setContent(con);
    }

    if (name === "ramcpu2") {
       con = {
        widgetName: 'RAM and CPU',
        picturesrc: 'assets/images/ramcpu_info.jpg',
        content: "This widget shows the CPU utilization and the RAM of a selected node. You can select a node inside the widget settings.",
        motivation: "This widget is for monitoring different nodes, to keep an eye on the system resources. If you see that you software are using to much resources of the system, you may want to upgrade to a better system for your software. It can indicate to a problem, too. Maybe your software has a bug and using unexcepted ressources."
      };
      this.setContent(con);
    }

    if (name === "eventlog") {
       con = {
        widgetName: 'Eventlog',
        picturesrc: 'assets/images/eventlog_info.jpg',
        content: "This widget gives u a list with all the landscape, where an event occurs. By clicking on a listitem a table with more information will pop out.",
        motivation: "This widget is for getting a better overview for what exactly happens inside your software. Sometimes a exception will be thrown after a long time of a running system. In this case the event will be shown inside this widget."
      };
      this.setContent(con);
    }

    if (name === "operationresponsetime") {
       con = {
        widgetName: 'Operation response time (pie chart)',
        picturesrc: 'assets/images/operationresponsetime_info.jpg',
        content: "This widget shows u the execution time of the longest taken operations inside the newest landscape. It shows u the five longest taken operations. If you want to see previous landscapes, then you can use a different widget that shows the data inside a table.",
        motivation: "This widget is good, if you want to find out which operation/function takes the longest inside your software. If you find out which methods take that long, then you can try to optimize them."
      };
      this.setContent(con);

    }


    if (name === "aggregatedresponsetime") {
       con = {
        widgetName: 'Aggregated response time (table)',
        picturesrc: 'assets/images/aggregatedresponsetime_info.jpg',
        content: "This widget shows the aggregated communication between two classes. It iterate through all the operations between two classes and adds the request response time together. Now you can see the communication between two classes and the overall execution time. This widget shows the different landscapes inside a list. If you click on a listitem, then a table with additional information will get loaded.",
        motivation: "If you want to find out, which methods take the longest, then you can use the operation response time widget. But if you want to get an overview about a higher level of abstraction, then you can use this widget."
      };
      this.setContent(con);
    }

    //no nicht fertig !

    if (name === "operationresponsetime-info") {
       con = {
        widgetName: 'Operation response time (table)',
        picturesrc: 'assets/images/operationresponsetime_table_info.jpg',
        content: "This widget shows the operation response time of all landscapes. First you see a list of the different landscapes. After clicking on a landscape a table with addtional information will pop out. It shows the operationname, the average response time of that operation, and the source/target clazz. The table is sorted with the average response time.",
        motivation: "This wigdet is good, if you want to find out which methods in your software need to be optimized. After clicking throw the different landscapes you can see very fast which methods slows your software down."
      };
      this.setContent(con);

    }

    if (name === "aggregatedresponsetime-pie") {
       con = {
        widgetName: 'Aggregated response time (pie chart)',
        picturesrc: 'assets/images/aggregatedresponsetime_piechart_info.jpg',
        content: "This widget shows the five highest aggregated response times in the current landscape. You get addtional information if you hover over a section in the chart. then you see the source/target clazz and how much requests are between that two classes.",
        motivation: "This widget gives you a higher abstraction, than the operation response time widget. It shows you the communication between classes. This is nice, if your software is very large and you want to know which classes need to be optimized in your system."
      };
      this.setContent(con);
    }
  },

  setContent(content) {
    this.set('content', content);
    $('#exampleModal').modal('show');
  },

  getContent() {
    return this.get('content');
  }
});
