"use strict";angular.module("noiseComplaintsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngMaterial","ngMessages"]).config(["$routeProvider","$httpProvider","$mdThemingProvider",function(a,b,c){b.defaults.headers.post["Content-Type"]="application/json",a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"})}]),angular.module("noiseComplaintsApp").controller("MainCtrl",["$scope","$location","$anchorScroll","$timeout","$http","$mdDialog","$window",function(a,b,c,d,e,f,g){var h=null,i=null;a.complaintTypes=[{label:"Loud Music"},{label:"Crowd/Voices"},{label:"Bass Effect"},{label:"Other"}],a.maxDate=new Date,a.scrollTo=function(a){d(function(){c(a)})},a.hours=["01","02","03","04","05","06","07","08","09","10","11","12"],a.minutes=["00","05","10","15","20","25","30","35","40","45","50","55"],a.ampms=["am","pm"],a.showSplash=function(a,b,c){f.show(f.alert().parent(angular.element(document.querySelector("#container"))).clickOutsideToClose(!0).title(c).content(b).ariaLabel(c).ok("Continue"))},a.showSuccess=function(a,b,c){f.show(f.alert().parent(angular.element(document.querySelector("#container"))).clickOutsideToClose(!0).title(c).content(b).ariaLabel(c).ok("Okay"))["finally"](function(){g.location.reload()})},a.zoomToBusiness=function(b){a.establishment=b,i.centerAndZoom(b.geometry,19)};var j=function(){var b="Establishment: "+a.establishment.attributes.ESTABLISHMENT+"\nComplaintant Name: "+a.complaintant.name+"\nComplaintant Phone: "+a.complaintant.phoneNumber+"\nComplaintant Email: "+a.complaintant.email+"\nDate: "+(a.complaintant.date.getMonth()+1)+"/"+a.complaintant.date.getDate()+"/"+a.complaintant.date.getFullYear()+"\nTime: "+a.complaintant.time.hour+":"+a.complaintant.time.minute+" "+a.complaintant.time.ampm+"\nLoud Music: "+(a.complaintant.music?"Yes":"No")+"\nCrowd/Voices: "+(a.complaintant.crowd?"Yes":"No")+"\nBass Effect: "+(a.complaintant.bass?"Yes":"No")+"\nOther: "+(a.complaintant.other?"Yes":"No")+"\nPrior to filing this complaint did you contact the establishment?: "+a.complaintant.question4+"\nDid you speak with a member of management?: "+a.complaintant.question5+"\nWas your complaint resolved?: "+a.complaintant.question6,c={from:"Hospitality District",fromEmail:"Hospitality@raleighnc.gov",to:"noiseofficer",toEmail:"justin.greco@raleighnc.gov",message:b,subject:"Hospitality District - online complaint"};e({url:"http://maps.raleighnc.gov/php/mail.php",method:"POST",params:c}).then(function(b){a.showSuccess(b,"Your complaint has been successfully sent!","Submitted Successfully")}),k()},k=function(){a.establishment=null,a.complaintant.name="",a.complaintant.phoneNumber="",a.complaintant.email="",a.complaintant.date="",a.complaintant.time="",a.complaintant.question4="",a.complaintant.question5="",a.complaintant.question6="",a.complaintant.music="",a.complaintant.crowd="",a.complaintant.bass="",a.complaintant.other="",a.complaintForm.$setPristine(),a.complaintForm.complaintant.$touched=!1,a.scrollTo("map")};a.question4Answered=function(){"Yes"==a.complaintant.question4?(a.scrollTo("question5"),a.complaintant.question5="",a.complaintant.question6=""):(a.scrollTo("submitButton"),a.complaintant.question5="No",a.complaintant.question6="No")},a.question5Answered=function(){"Yes"==a.complaintant.question4?(a.scrollTo("question6"),a.complaintant.question6=""):(a.scrollTo("submitButton"),a.complaintant.question6="No")},a.submitForm=function(a,b){var c=[[{attributes:{BUSINESSOID:b.attributes.OBJECTID,ESTABLISHMENT:b.attributes.ESTABLISHMENT,NAME:a.name,PHONE:a.phoneNumber,EMAIL:a.email,OCCUR_DATE:a.date,OCCUR_TIME:a.time.hour+":"+a.time.minute+" "+a.time.ampm,CONTACTED:a.question4,SPOKE:a.question5,RESOLVED:a.question6,MUSIC:a.music?"Yes":"No",CROWD:a.crowd?"Yes":"No",BASS:a.bass?"Yes":"No",OTHER_TYPE:a.other?"Yes":"No"}}]],f={features:c,f:"json"};e({url:"http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/2/addFeatures",method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},params:f}).then(function(a){d(function(){j()})},function(a){console.log(a)})},require(["esri/map","esri/layers/VectorTileLayer","esri/layers/FeatureLayer","esri/dijit/Popup","esri/dijit/PopupTemplate","dojo/on","esri/renderers/SimpleRenderer","dijit/TooltipDialog","dijit/popup","dojo/dom-construct","dojo/domReady!"],function(b,c,d,e,f,g,j,k,l,m){function n(a){var b=a.graphic.attributes.ESTABLISHMENT+"<br/>"+a.graphic.attributes.ADDRESS;return r.setContent(b),l.open({popup:r,x:a.pageX+10,y:a.pageY+10}),!1}function o(a){l.close(r)}i=new b("map",{center:[-78.646,35.785],zoom:14});var p=new c("http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json");i.addLayer(p);var q=new d("http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/1");i.addLayer(q);new f({title:"{ESTABLISHMENT}",description:'<md-content><md-button class="md-raised md-primary">File Complaint</md-button></md-content>'});h=new d("http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0",{mode:d.MODE_SNAPSHOT,outFields:["*"]}),i.addLayer(h),a.establishments=[],g(h,"graphic-add",function(b){a.establishments.push({attributes:b.graphic.attributes,geometry:b.graphic.geometry}),a.$apply()}),g(h,"click",function(b){console.log(b);for(var c=0;c<a.establishments.length;c++)b.graphic.attributes===a.establishments[c].attributes&&(a.establishment=a.establishments[c]);i.centerAndZoom(b.graphic.geometry,19),a.scrollTo("question2"),a.$apply()});var r=new k({id:"tooltip"});r.startup(),g(h,"mouse-over",n),g(h,"mouse-out",o),g(i,"pan",o),h.setRenderer(new j({type:"simple",label:"",description:"",symbol:{color:[255,0,0,203],size:8,angle:0,xoffset:0,yoffset:0,type:"esriSMS",style:"esriSMSCircle",outline:{color:[255,255,255,255],width:.99975,type:"esriSLS",style:"esriSLSSolid"}}}))})}]),angular.module("noiseComplaintsApp").run(["$templateCache",function(a){a.put("views/main.html",'<div ng-init="showSplash($event, \'Information submitted on the Online HDEP Complaint Form is a public record.\', \'Disclaimer\')"> <md-toolbar md-scroll-shrink> <div class="md-toolbar-tools">Online Noise Complaint Form</div> </md-toolbar> <div class=""> <div id="map" style="height:300px; width:100%"><div id="tooltip"></div></div> </div> <div flex layout-padding layout-align="center center"> <div id="question1" layout-align="center center" layout="column"> <h2 class="md-title">1. Select an Establishment</h2> <md-input-container> <label>Establishment</label> <md-select ng-model="establishment" ng-change="scrollTo(\'question2\');zoomToBusiness(establishment);"> <md-option ng-repeat="establishment in establishments  | orderBy: \'attributes.ESTABLISHMENT\' track by establishment.attributes.ESTABLISHMENT" ng-value="establishment"> {{establishment.attributes.ESTABLISHMENT}} </md-option> </md-select> </md-input-container> </div> <div id="question2" ng-show="establishment" layout-align="center center" layout="column"> <h2 class="md-title">2. To resolve your complaint the City of Raleigh encourages you to contact the business directly at</h2> <a ng-href="tel:1-{{establishment.attributes.PHONE}}"><h2>{{establishment.attributes.PHONE}}</h2></a> <span class="md-body-2">(Contact {{establishment.attributes.CONTACT}})</span> <span class="alert911"> If this is an emergency please call 911 </span> <md-button class="md-raised md-primary" ng-click="complaintant.question2 = true;scrollTo(\'question3\');">Continue with Online Complaint</md-button> </div> <div id="question3" ng-show="complaintant.question2" layout-align="center center" layout="column"> <h2 class="md-title">3. Fill out the following form</h2> <form name="complaintForm"> <md-input-container class="md-block"> <label>Your Name</label> <input required name="complaintant" ng-model="complaintant.name" md-maxlength="50"> <div ng-messages="complaintForm.complaintant.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <md-input-container class="md-block" flex-gt-sm> <label>Phone Number</label> <input name="phone" ng-model="complaintant.phoneNumber" ng-pattern="/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/" md-maxlength="12"> <div class="hint" ng-show="showHints">###-###-####</div> <div ng-messages="complaintForm.phone.$error" ng-hide="showHints"> <div ng-message="pattern">###-###-#### - Please enter a valid phone number.</div> </div> </md-input-container> <md-input-container class="md-block"> <label>Your Email</label> <input required type="email" name="complaintantEmail" ng-model="complaintant.email" minlength="10" maxlength="50" ng-pattern="/^.+@.+\\..+$/" md-maxlength="50"> <div ng-messages="complaintForm.complaintantEmail.$error" role="alert"> <div ng-message-exp="[\'required\', \'minlength\', \'maxlength\', \'pattern\']"> Your email must be between 10 and 50 characters long and look like an e-mail address. </div> </div> </md-input-container> <md-content> <md-datepicker id="date" name="date" ng-model="complaintant.date" md-min-date="minDate" md-max-date="maxDate"></md-datepicker> <div ng-messages="complaintForm.date.$error"> <div ng-message="required">This is required.</div> </div> </md-content> <div class="row" align="center center"> <md-input-container> <label>Hour</label> <md-select ng-model="complaintant.time.hour" required> <md-option ng-repeat="hour in hours" ng-value="hour"> {{hour}} </md-option> </md-select> <div ng-messages="complaintForm.date.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <md-input-container> <label>Minute</label> <md-select ng-model="complaintant.time.minute" required> <md-option ng-repeat="minute in minutes" ng-value="minute"> {{minute}} </md-option> </md-select> <div ng-messages="complaintForm.date.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <md-input-container> <label>am/pm</label> <md-select ng-model="complaintant.time.ampm" required> <md-option ng-repeat="ampm in ampms" ng-value="ampm"> {{ampm}} </md-option> </md-select> <div ng-messages="complaintForm.date.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> </div> <br> <div layout="column"> <md-checkbox ng-model="complaintant.music"> Loud Music </md-checkbox> <md-checkbox ng-model="complaintant.crowd"> Crowd/Voices </md-checkbox> <md-checkbox ng-model="complaintant.bass"> Bass Effect </md-checkbox> <md-checkbox ng-model="complaintant.other"> Other </md-checkbox> </div> </form> <md-button ng-disabled="complaintForm.$invalid" ng-click="complaintant.question3 = true;scrollTo(\'question4\')" class="md-raised md-primary">Continue</md-button> </div> <div id="question4" ng-show="complaintant.question3 || complaintForm.input.$error" layout-align="center center" layout="column"> <h2 class="md-title">4. Prior to filing this complaint did you contact the establishment?</h2> <md-radio-group ng-model="complaintant.question4" ng-click="question4Answered()"> <md-radio-button value="Yes" class="md-primary">Yes</md-radio-button> <md-radio-button value="No"> No </md-radio-button> </md-radio-group> </div> <div id="question5" ng-show="complaintant.question4 ==\'Yes\'" layout-align="center center" layout="column"> <h2 class="md-title">5. Did you speak with a member of management?</h2> <md-radio-group ng-model="complaintant.question5" ng-click="question5Answered()"> <md-radio-button value="Yes" class="md-primary">Yes</md-radio-button> <md-radio-button value="No"> No </md-radio-button> </md-radio-group> </div> <div id="question6" ng-show="complaintant.question5 ==\'Yes\'" layout-align="center center" layout="column"> <h2 class="md-title">6. Was your complaint resolved?</h2> <md-radio-group ng-model="complaintant.question6" ng-click="scrollTo(\'submitButton\')"> <md-radio-button value="Yes" class="md-primary">Yes</md-radio-button> <md-radio-button value="No"> No </md-radio-button> </md-radio-group> </div> <div layout-align="center center" layout="row" ng-show="complaintant.question6 || complaintant.question5 == \'No\' || complaintant.question4 == \'No\'"> <md-button id="submitButton" class="md-raised md-primary" ng-click="submitForm(complaintant, establishment)">Submit</md-button> </div> </div> </div>')}]);