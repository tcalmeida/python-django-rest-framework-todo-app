// to send crsf token in form via AJAX (django docs)
function getCookie(name) {
		    var cookieValue = null;
		    if (document.cookie && document.cookie !== '') {
		        var cookies = document.cookie.split(';');
		        for (var i = 0; i < cookies.length; i++) {
		            var cookie = cookies[i].trim();
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }
		    }
		    return cookieValue;
		}
var csrftoken = getCookie('csrftoken');

let activeTask = null
let tasks_snap = []

function createList(){
    const wrapper = document.getElementById("list-wrapper")
    let url = 'http://127.0.0.1:8000/list-tasks/'

    fetch(url).then((resp) => resp.json()).then(function(data){
        const list = data
        for (i in list){

            //prevent re-render the page when remove task
            try {
                 document.getElementById(`data-row-${i}`).remove()
            } catch(error){}

            let title = `<span class='title'>${list[i].title}</span>`
            if (list[i].completed == true){
               title = `<strike class='title'>${list[i].title}</strike>`
            }
            const task = `
                <div id='data-row-${i}' class='task-wrapper flex-wrapper'>
                    <div style="flex:7">
                       ${title}
                    </div>
                    <div style="flex:1">
                        <button class='btn btn-sm btn-outline-info edit'>Edit</button>
                    </div>
                    <div style="flex:1">
                        <button class='btn btn-sm btn-outline-dark delete'>-</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += task
        }

        // maintain the page on edited task
        if (tasks_snap.length > list.length){
            for(let i = list.length; i < tasks_snap.length; i++){
                document.getElementById(`data-row-${i}`).remove()
            }
        }
        tasks_snap = list

        // event to permit click each edit and delete btn separately - identifying each task
        for (i in list){
            let editBtn = document.getElementsByClassName('edit')[i]
            let deleteBtn = document.getElementsByClassName('delete')[i]
            let status = document.getElementsByClassName('title')[i]

            editBtn.addEventListener('click', (function(task){
                return function(){
                    editTask(task)
                }
            })(list[i]))

            deleteBtn.addEventListener('click', (function(task){
                return function(){
                    deleteTask(task)
                }
            })(list[i]))

            status.addEventListener('click', (function(task){
                return function(){
                    statusTask(task)
                }
            })(list[i]))
        }
    })
}

// form submission to server - create task
const form = document.getElementById('form-wrapper')
    form.addEventListener('submit', function(e){
        e.preventDefault()
        var url = 'http://127.0.0.1:8000/create-task/'

        // to update task and submit it to server
        if (activeTask != null){
             var url = 'http://'+`127.0.0.1:8000/update-task/${activeTask.id}/`
             activeTask = null
        }

        let title = document.getElementById('title').value
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body: JSON.stringify({'title': title})
        }).then(function(response){
            createList()          // return tasks after POST
            document.getElementById('form').reset()
        })
    })

// edit task in title form when btn is clicked
function editTask(task){
			activeTask = task
			document.getElementById('title').value = activeTask.title
		}

function deleteTask(task){
    let url = `http://127.0.0.1:8000/delete-task/${task.id}/`
    fetch(url, {
         method: 'DELETE',
         headers: {
             'Content-type': 'application/json',
             'X-CSRFToken':csrftoken,
         }
    }).then((response) => {
        createList()
    })
}

// define if task was completed or not
function statusTask(task) {
    task.completed = !task.completed
     let url = `http://127.0.0.1:8000/update-task/${task.id}/`
    fetch(url, {
         method: 'POST',
         headers: {
             'Content-type': 'application/json',
             'X-CSRFToken':csrftoken,
         },
         body: JSON.stringify({'title': task.title,
         'completed': task.completed
         })
    }).then((response) => {
        createList()
    })
}

createList()