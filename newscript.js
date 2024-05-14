
$(document).ready(function(){

    teams = []
    team_choice = []
    teams_count = 0
    var status = "offline"
    var score1=0
    var score2=0
    timestate=0
    var secondcount=0
    var minutecount=0
    newid = Math.random() * 1000;
    var tournament_name = ""
    var view_game_filter_choice = "all"
    newid = Math.ceil(newid)
    game_running=false
    game_viewing=false

    const host_button = document.getElementById("host-button")
    const view_button = document.getElementById("view-button")

    function color(){
        if(score1 == score2)
        {
            document.getElementById("score1-text").style.color = '#010101'
            document.getElementById("score2-text").style.color = '#010101'
        }
    
        else if(score1> score2)
        {
            document.getElementById("score1-text").style.color = '#010101'
            document.getElementById("score2-text").style.color = '#515151'
        }
        else{
            document.getElementById("score2-text").style.color = '#010101'
            document.getElementById("score1-text").style.color = '#515151'
        }
    }

    host_button.addEventListener('click', e => { 
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("select-sports-page-container").style.display = "block";
    }) 

    view_button.addEventListener('click', e => { 
        document.getElementById("home-page-container").style.display = "none";
        document.getElementById("view-games-page-container").style.display = "block";

        game_viewing=true

        if(view_game_filter_choice=="all")
            {
                fetch('http://54.79.31.96:3000/getAll')
                .then(response => response.json())
                .then(data => loadgameTable(data['data']))
            }

        else if(view_game_filter_choice=="live")
            {
                fetch('http://54.79.31.96:3000/getAlllive')
                .then(response => response.json())
                .then(data => loadgameTable(data['data']))
            }
        
    }) 

    function loadgameTable(data){

        const game_container = document.getElementById('view-games-options-box');
        if(data.length == 0){
            game_container.innerHTML = 
            '<div  class="view-games-options">'+
                '<div id="view-games-options-title" class="view-games-options-title vgo">NO GAMES FOUND</div>'+
            '</div>'
    
        }
    
        else{
            console.log(data.length)
            let formatHTML = ""
    
            data.forEach(function({id, tournamentname, sport, gamestatus, teamscoreone, teamscoretwo, teamnameone, teamnametwo, timem, times}){
    
                if(sport == 'fb')
                    sport = 'football'
                
                if(gamestatus=="live")
                    statushtml = "view-games-options-status-live"

                else statushtml= "view-games-options-status"

                formatHTML += 
                '<div  class="view-games-options">'+
                    '<div id="view-games-options-title" class="view-games-options-title vgo">'+tournamentname+'</div>'+
                    '<div id="view-games-options-team-names" class="view-games-options-team-names vgo">'+teamnameone+' vs '+teamnametwo+'</div>'+
                    '<div id="view-games-options-time" class="view-games-options-time vgo">TIME : '+timem+':'+times+'</div>'+
                    '<div id="view-games-options-team-score" class="view-games-options-team-score vgo">SCORE : '+teamscoreone+'-'+teamscoretwo+'</div>'+
                    '<div id="view-games-options-status"class="'+statushtml+' vgo">'+gamestatus+'</div>'+
                    '<div id="view-games-options-sport"class="view-games-options-sport vgo">'+sport+'</div>'+
                '</div>'
                
            })
    
        game_container.innerHTML = formatHTML;
        }
        
        
    }

    const view_all_button = document.getElementById("vag")
    const view_live_button = document.getElementById("vlg")
    const view_past_button = document.getElementById("vpg")

    view_all_button.addEventListener("click", (e)=>{
        view_game_filter_choice = "all"

        document.getElementById("vag").className="view-games-filters-active"
        document.getElementById("vlg").className="view-games-filters"
        document.getElementById("vpg").className="view-games-filters"

    })

    view_live_button.addEventListener("click", (e)=>{
        view_game_filter_choice = "live"

        document.getElementById("vag").className="view-games-filters"
        document.getElementById("vlg").className="view-games-filters-active"
        document.getElementById("vpg").className="view-games-filters"

    })

    view_past_button.addEventListener("click", (e)=>{
        view_game_filter_choice = "past"

        document.getElementById("vag").className="view-games-filters"
        document.getElementById("vlg").className="view-games-filters"
        document.getElementById("vpg").className="view-games-filters-active"

    })

    const fb = document.getElementById("fb");
    const bb = document.getElementById("bb");
    const bd = document.getElementById("bd");
    const kb = document.getElementById("kb");
    const select_sport_submit = document.getElementById("ssosb");

    var sports_choice = "none"

    fb.addEventListener('click', e => { 
        document.getElementById("fb").className = "select-sport-options-active"
        document.getElementById("bb").className = "select-sport-options"
        document.getElementById("bd").className = "select-sport-options"
        document.getElementById("kb").className = "select-sport-options"

        sports_choice = "football"
    }) 

    bb.addEventListener('click', e => { 
        document.getElementById("bb").className = "select-sport-options-active"
        document.getElementById("fb").className = "select-sport-options"
        document.getElementById("bd").className = "select-sport-options"
        document.getElementById("kb").className = "select-sport-options"

        sports_choice = "basketball"
    }) 

    bd.addEventListener('click', e => { 
        document.getElementById("bd").className = "select-sport-options-active"
        document.getElementById("bb").className = "select-sport-options"
        document.getElementById("fb").className = "select-sport-options"
        document.getElementById("kb").className = "select-sport-options"

        sports_choice = "badminton"
    }) 

    kb.addEventListener('click', e => { 
        document.getElementById("kb").className = "select-sport-options-active"
        document.getElementById("bb").className = "select-sport-options"
        document.getElementById("bd").className = "select-sport-options"
        document.getElementById("fb").className = "select-sport-options"

        sports_choice = "kabaddi"
    }) 

    select_sport_submit.addEventListener('click', e => { 

        tournament_name = document.getElementById('ssi').value
        console.log(tournament_name)

        if(tournament_name!="" && sports_choice!="none")
            {   
                
                document.getElementById("select-sports-page-container").style.display="none"
                document.getElementById("team-create-page-container").style.display="block"
                
            }
        
    }) 

    $(".team-add-button").click(function(){
        
        // Finding total number of elements added
        var total_element = $(".team-names-box").length;
        console.log(total_element)
        // last <div> with element class id
        var lastid = $(".team-names-box:last").attr("id");
        
        var split_id = lastid.split("_");
        var nextindex = Number(split_id[1]) + 1;
 
        var max = 10;

        x = document.getElementById("tni")
        text = x.value
        // Check total number elements
        if(text!='')
        if(total_element < max ){
             // Adding new div container after last occurance of element class
             $(".team-names-box:last").after("<div class='team-names-box' id='div_"+ nextindex +"'></div>");
            
             // Adding element to <div>
             $("#div_" + nextindex).append("<div id='txt_"+ nextindex +"' class='team-name-box' >" + text + "</div><div id='remove_" + nextindex + "' class='team-delete'>x</div>");
            
             x.value = ''
             teams.push(text)
        }
  
    });

    $('.team-create-box').on('click','.team-delete',function(){
  
        var id = this.id;
        var split_id = id.split("_");
        var deleteindex = split_id[1];
        console.log(deleteindex)
        
        test = "div_"+ deleteindex
        search = document.getElementById(test).textContent

        var index = teams.indexOf(search)
        teams.splice(index, 1);
        
        // Remove <div> with id
    
        $("#div_" + deleteindex).remove();
 
    }); 

    const create_team_submit = document.getElementById("tcsb");

    create_team_submit.addEventListener('click', e => { 

                document.getElementById("team-create-page-container").style.display="none"
                document.getElementById("team-select-page-container").style.display="block"

                teams.forEach(function(value){
        
                    $("#teams-box").append("<div id="+"'"+value+"'"+"class='teams-box-options'><p>"+value+"</p></div>")
                }); 
    }) 

    $('.teams-box').on('click','.teams-box-options',function(){
        var id = this.id
        
        if(teams_count<2){
            teams_count+=1
            team_choice.push(document.getElementById(id).textContent)
            document.getElementById(id).className = 'teams-box-options-active'
            console.log(team_choice)
        }
        
    })

    $('.teams-box').on('click','.teams-box-options-active',function(){
        var id = this.id
        
        if(teams_count>=0){
            teams_count-=1
            document.getElementById(id).className = 'teams-box-options'

            search = document.getElementById(id).textContent

            var index = team_choice.indexOf(search)
            team_choice.splice(index, 1);
            console.log(team_choice)
        }
        
    })

    const select_team_submit = document.getElementById("tssb");

    select_team_submit.addEventListener('click', e => { 

        document.getElementById("team-select-page-container").style.display="none"

        if(sports_choice=="football"){
            document.getElementById("football-match").style.display="block"
            status = "live"

            document.getElementById("team-1-name").innerHTML=team_choice[0]
            document.getElementById("team-2-name").innerHTML=team_choice[1]

        }

        game_running=true
        status='live'

        fetch('http://54.79.31.96:3000/insert', {
                headers:{
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    m: minutecount,
                    s: secondcount,
                    team1score: score1,
                    team2score: score2,
                    team1name: team_choice[0],
                    team2name: team_choice[1],
                    tournamentname: tournament_name,
                    sport: sports_choice,
                    id: newid,
                    gamestatus:status
                })
                
            }).then(response => response.json())

    });

    
    const score1plus = document.getElementById("score-1-plus")
    const score1minus = document.getElementById("score-1-minus")
    const score2plus = document.getElementById("score-2-plus")
    const score2minus = document.getElementById("score-2-minus")

    const timerplay = document.getElementById("timer-play")
    const timerpause = document.getElementById("timer-pause")
    const timerend = document.getElementById("timer-end")

    score1plus.addEventListener('click', e => {
        score1+=1
        document.getElementById("score1-text").innerHTML=score1
        color()
    });

    score1minus.addEventListener('click', e => {
        score1-=1
        document.getElementById("score1-text").innerHTML=score1
        color()
    });

    score2plus.addEventListener('click', e => {
        score2+=1
        document.getElementById("score2-text").innerHTML=score2
        color()
    });

    score2minus.addEventListener('click', e => {
        score2-=1
        document.getElementById("score2-text").innerHTML=score2
        color()
    });

    timerplay.addEventListener('click', (e)=>{
        timestate=1
    })

    timerpause.addEventListener('click', (e)=>{
        timestate=0
    })

    timerend.addEventListener('click', (e)=>{

        game_running=false

        fetch('http://54.79.31.96:3000/update', {
                    headers:{
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        m: minutecount,
                        s: secondcount,
                        team1score: score1,
                        team2score: score2,
                        id: newid,
                        gamestatus:'past'
                    })
                    
                }).then(response => response.json())

        document.getElementById("football-match").style.display="none"
        document.getElementById("home-page-container").style.display="block"
        timestate=0
        
    });

    setInterval(function() {
        if(timestate==1)
            {   
                secondcount +=1

                if(secondcount == 60)
                    {
                        secondcount = 0
                        minutecount+=1
                    }
                
                if(secondcount<10){
                    s = String(secondcount)
                    placeholder = "0"
                    s = placeholder.concat("",s)
                }
                else s = String(secondcount);
                
                if(minutecount<10)
                    {
                        m = String(minutecount)
                        placeholder = "0"
                        m = placeholder.concat("",m)
                    }
                

                time = m.concat(":", s)

                document.getElementById("time-text").innerHTML = time
            }

        if(game_running==true)
                {   
                    console.log("running")
                    fetch('http://54.79.31.96:3000/update', {
                    headers:{
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        m: minutecount,
                        s: secondcount,
                        team1score: score1,
                        team2score: score2,
                        id: newid,
                        gamestatus:status
                    })
                    
                }).then(response => response.json())
                }

            
        if(game_viewing==true){

            if(view_game_filter_choice=="all")
                {
                    fetch('http://54.79.31.96:3000/getAll')
                    .then(response => response.json())
                    .then(data => loadgameTable(data['data']))
                }
    
            else if(view_game_filter_choice=="live")
                {
                    fetch('http://54.79.31.96:3000/getAlllive')
                    .then(response => response.json())
                    .then(data => loadgameTable(data['data']))
                }
        }
            
        
    }, 1000); // 60 * 1000 milsec

    



}) 






