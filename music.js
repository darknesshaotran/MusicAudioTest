const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBTN = $('.btn-toggle-play');
const cd = $('.cd');
const progress = $('.progress');
const nextBTN = $('.btn-next');
const prevBTN = $('.btn-prev');
const RandomBTN = $('.btn-random');
const repeatBTN = $('.btn-repeat');
const song = $('.song');

const app = {
    currentIndex : 5,
    isPlaying : false,
    songs: [
        {
          name: "Emergency",
          singer: "Icona Pop",
          path: "song7.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "The Other Line",
          singer: "Chunk! No, Captain Chunk!",
          path: "song6.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Ashes on The Fire",
          singer: "Attack on Titan OST",
          path:
            "song8.mp3",
          image: "https://gamehot24h.com/wp-content/uploads/2020/10/Attack-on-Titian-Final-Season-1-game4v_1602340098.jpg"
        },
        {
          name: "Ngôi Sao Cô Đơn",
          singer: "Jack-Duck Man",
          path: "song4.mp3",
          image:
            "https://kenh14cdn.com/203336854389633024/2022/7/21/photo-1-16583868351951875491255.jpg"
        },
        {
          name: "LAYLALAY",
          singer: "Jack-J97",
          path: "song5.mp3",
          image:
            "https://i.pinimg.com/originals/01/83/4f/01834f148f0b77c26a9f2710491a83d9.jpg"
        },
        {
          name: "Ôm trọn nỗi nhớ",
          singer: "RUM",
          path:
            "song1.mp3",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2019/08/05/9/4/a/6/1565017542523_640.jpg"
        },
        {
          name: "Ánh sao và bầu trời",
          singer: "TRI x Cá",
          path: "song2.mp3",
          image:
            "https://i1.sndcdn.com/artworks-FYlZeEdyC6FDDiYs-H8KP0A-t500x500.jpg" 
        }
    ],
    render: function(){
        const htmls = this.songs.map((song,index)=>
        {
            return `
                    <div class="song ${index === this.currentIndex ? 'active': ''} " song-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML  = htmls.join('');
        this.scrollToActiveSong();

    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get: function()
            {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        // xử lí khi lăn chuột 
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth> 0 ? newWidth+'px': 0;
            cd.style.opacity = newWidth/cdWidth;
        
        }
        // xử lí cd  tự quay khi nhạc chạy
        var cd_rotation = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }     
        ],
            {
                duration: 10000, // 10second
                iterations: Infinity
            })
        cd_rotation.pause();  
        // xử lí  khi ấn dừng/phát bài hát
        playBTN.onclick = function()
        {
            if(app.isPlaying)
            {       
                audio.pause();
            }
            else
            {
                  audio.play();
            }
        }
        audio.onplay = function(){
            cd_rotation.play(); 
            player.classList.add('playing');
            app.isPlaying = true;
        }
        audio.onpause = function(){
            cd_rotation.pause(); 
            player.classList.remove('playing');
            app.isPlaying = false;
        }

        
        audio.ontimeupdate = function(){
            if(audio.duration)
            {
                const progressPercent  =  Math.floor(audio.currentTime/ audio.duration *100);
                progress.value = progressPercent;
                // console.log(audio.currentTime);
                
                
            }
        }
        //xử lí khi tua nhạc 
        progress.oninput = function(e){                 // onchange
            audio.currentTime = e.target.value * audio.duration/100;
            
        }
        // khi next song
        nextBTN.onclick=function()
        {
            app.nextSong();
            audio.play();  
            app.render(); 
        }
        // khi prev song
        prevBTN.onclick = function()
        {
                app.prevSong();
                audio.play();
                app.render();
        }
        // xử lí khi ấn random
        RandomBTN.onclick = function()
        {
            if(RandomBTN.classList.contains('active'))
            {
                RandomBTN.classList.remove('active');
            }
            else
            {
                RandomBTN.classList.add('active');
                
            }

        }
        repeatBTN.onclick = function()
        {
            if(repeatBTN.classList.contains('active'))
            {
                repeatBTN.classList.remove('active');
            }
            else
            {
                repeatBTN.classList.add('active');
                
            }

        }
        // khi kết thúc bài hát
        audio.onended = function(){

            if(repeatBTN.classList.contains('active'))
            {
                audio.play();
            }
            else
            {
                if(RandomBTN.classList.contains('active'))
                    {
                        
                        setTimeout(() => 
                        {
                            app.randomSong();
                            audio.play();
                            app.render();
                        }, 1000);
                    }
                    else
                    {
                        setTimeout(() => {
                            app.nextSong();
                            audio.play();
                            app.render();
                        }, 1000);
                    }
            }
                    
                
        }
        // bấm chọn 1 bài hát
        playlist.onclick = function(e){
            if(e.target.closest('.song:not(.active)')&& !e.target.closest('.option'))
            {
                var index = e.target.closest('.song').getAttribute('song-index');
               app.changeSong(Number(e.target.closest('.song').getAttribute('song-index')));
               audio.play();
               app.render();

            }
        }
            
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        
        if(this.currentIndex == this.songs.length-1)
        {
            this.currentIndex = 0;
        }
        else
        {
            this.currentIndex++;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        if(this.currentIndex==0)
        {
            this.currentIndex = this.songs.length-1;
        }
        else
        {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        
        
    },
    changeSong: function(index){
        this.currentIndex = index;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function(){
        $('.song.active').scrollIntoView({
            behavior:'smooth',
            block: 'center'

        });
    },
    start: function(){
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
    }
    

}

app.start();
