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

function createList(){
    const wrapper = document.getElementById("list-wrapper")
    wrapper.innerHTML = ''
    let url = 'http://127.0.0.1:8000/list-tasks/'

    fetch(url).then((resp) => resp.json()).then(function(data){
        console.log('data:', data)

        const list = data
        for (i in list){
            const task = `
                <div id='data-row-${i}' class='task-wrapper flex-wrapper'>
                    <div style="flex:7">
                        <span class='title'>${list[i].title}</span>
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
    })
}

const form = document.getElementById('form-wrapper')
    // form submission
    form.addEventListener('submit', function(e){
        e.preventDefault()
        console.log('Form submitted')
        let url = 'http://127.0.0.1:8000/create-task/'
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




createList()