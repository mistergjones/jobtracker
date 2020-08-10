var activeNavlink = document.querySelectorAll('nav a[href^="/' + location.pathname.split("/")[1] + '"]');
activeNavlink[0].firstElementChild.classList.add('active');