// =====================================================
// BeatFlow - Music Playlist Creator
// jQuery Mobile App with interactive list filtering
// Features: Song Library, Playlist CRUD, Now Playing
// =====================================================

$(document).ready(function () {
    'use strict';

    // ===== STORAGE =====
    var Storage = {
        get: function (key, fallback) {
            try {
                var d = localStorage.getItem(key);
                return d ? JSON.parse(d) : (fallback || null);
            } catch (e) { return fallback || null; }
        },
        set: function (key, val) {
            localStorage.setItem(key, JSON.stringify(val));
        }
    };

    // ===== SEED DATA =====
    var DEFAULT_SONGS = [
        { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', duration: 200 },
        { id: 's2', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 355 },
        { id: 's3', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', genre: 'Pop', duration: 234 },
        { id: 's4', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile OST', genre: 'Hip-Hop', duration: 326 },
        { id: 's5', title: 'Strobe', artist: 'Deadmau5', album: 'For Lack of a Better Name', genre: 'Electronic', duration: 637 },
        { id: 's6', title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz', duration: 324 },
        { id: 's7', title: 'Blinding Lights (Remix)', artist: 'The Weeknd ft. Rosalía', album: 'After Hours Deluxe', genre: 'Pop', duration: 215 },
        { id: 's8', title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', genre: 'Rock', duration: 482 },
        { id: 's9', title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', album: 'Classical Essentials', genre: 'Classical', duration: 360 },
        { id: 's10', title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', genre: 'Indie', duration: 229 },
        { id: 's11', title: 'Blinding Lights', artist: 'Khalid', album: 'Free Spirit', genre: 'R&B', duration: 198 },
        { id: 's12', title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177 },
        { id: 's13', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', genre: 'Electronic', duration: 243 },
        { id: 's14', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', duration: 391 },
        { id: 's15', title: 'Fever', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 212 },
        { id: 's16', title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', duration: 562 },
        { id: 's17', title: 'Sweater Weather', artist: 'The Neighbourhood', album: 'I Love You.', genre: 'Indie', duration: 240 },
        { id: 's18', title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite bergamasque', genre: 'Classical', duration: 305 },
        { id: 's19', title: 'Kiss Me More', artist: 'Doja Cat ft. SZA', album: 'Planet Her', genre: 'R&B', duration: 209 },
        { id: 's20', title: 'Levels', artist: 'Avicii', album: 'True', genre: 'Electronic', duration: 198 }
    ];

    var DEFAULT_PLAYLISTS = [
        {
            id: 'p1',
            name: 'Workout Beast Mode',
            description: 'High energy tracks to crush your gym session',
            mood: 'Energetic',
            songIds: ['s4', 's12', 's5', 's13', 's20'],
            createdAt: Date.now() - 86400000
        },
        {
            id: 'p2',
            name: 'Late Night Chill',
            description: 'Smooth vibes for winding down',
            mood: 'Chill',
            songIds: ['s9', 's18', 's6', 's16', 's17'],
            createdAt: Date.now() - 172800000
        },
        {
            id: 'p3',
            name: 'Pop Hits 2024',
            description: 'The biggest pop anthems',
            mood: 'Party',
            songIds: ['s1', 's3', 's7', 's15', 's19'],
            createdAt: Date.now() - 259200000
        }
    ];

    // ===== STATE =====
    var songs = Storage.get('bf_songs', DEFAULT_SONGS);
    var playlists = Storage.get('bf_playlists', DEFAULT_PLAYLISTS);
    var nowPlaying = Storage.get('bf_nowPlaying', null);
    var isPlaying = false;
    var playbackTimer = null;
    var currentTime = 0;
    var isShuffle = false;
    var isRepeat = false;
    var currentPlaylist = null; // playlist being viewed in detail
    var currentQueueIds = []; // song IDs in current play queue

    if (!Storage.get('bf_songs')) Storage.set('bf_songs', DEFAULT_SONGS);
    if (!Storage.get('bf_playlists')) Storage.set('bf_playlists', DEFAULT_PLAYLISTS);

    // ===== UTILITY =====
    function formatTime(seconds) {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function showToast(msg, type) {
        type = type || 'success';
        var $t = $('<div class="toast ' + type + '">' + msg + '</div>');
        $('#toastContainer').append($t);
        setTimeout(function () { $t.remove(); }, 2500);
    }

    function getMoodIcon(mood) {
        var icons = {
            'Energetic': 'fa-fire',
            'Chill': 'fa-water',
            'Romantic': 'fa-heart',
            'Focus': 'fa-bullseye',
            'Party': 'fa-champagne-glasses',
            'Sad': 'fa-cloud-rain',
            'Motivational': 'fa-dumbbell'
        };
        return icons[mood] || 'fa-music';
    }

    function getMoodClass(mood) {
        return (mood || 'chill').toLowerCase();
    }

    // ===== RENDER SONG LIBRARY =====
    function renderSongLibrary() {
        var $list = $('#songLibraryList');
        var genreVal = $('#genreFilterHome').val();
        var filtered = songs;

        if (genreVal && genreVal !== 'all') {
            filtered = songs.filter(function (s) { return s.genre === genreVal; });
        }

        $list.empty();

        if (filtered.length === 0) {
            $list.hide();
            $('#emptyLibrary').show();
        } else {
            $('#emptyLibrary').hide();
            $list.show();

            filtered.forEach(function (song) {
                var isActive = nowPlaying && nowPlaying.id === song.id;
                var html = '<li data-song-id="' + song.id + '" data-filtertext="' + song.title + ' ' + song.artist + ' ' + song.genre + '">' +
                    '<a href="#" class="song-list-item">' +
                        '<div class="song-item-content">' +
                            '<div class="song-icon">' +
                                '<i class="fas ' + (isActive && isPlaying ? 'fa-volume-high' : 'fa-music') + '"></i>' +
                            '</div>' +
                            '<div class="song-details">' +
                                '<h3>' + song.title + '</h3>' +
                                '<p>' + song.artist + ' • ' + song.album + '</p>' +
                            '</div>' +
                            '<div class="song-meta">' +
                                '<span class="song-duration">' + formatTime(song.duration) + '</span>' +
                                '<br><span class="song-genre-tag">' + song.genre + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</li>';
                $list.append(html);
            });
        }

        $list.listview('refresh');
    }

    // ===== RENDER PLAYLISTS =====
    function renderPlaylists() {
        var $list = $('#playlistList');
        $list.empty();

        if (playlists.length === 0) {
            $list.hide();
            $('#emptyPlaylists').show();
        } else {
            $('#emptyPlaylists').hide();
            $list.show();

            playlists.forEach(function (pl) {
                var songCount = pl.songIds.length;
                var totalDur = 0;
                pl.songIds.forEach(function (sid) {
                    var s = songs.find(function (song) { return song.id === sid; });
                    if (s) totalDur += s.duration;
                });

                var html = '<li data-playlist-id="' + pl.id + '">' +
                    '<a href="#playlistDetailPage" class="playlist-list-item">' +
                        '<div class="playlist-item-content">' +
                            '<div class="playlist-icon ' + getMoodClass(pl.mood) + '">' +
                                '<i class="fas ' + getMoodIcon(pl.mood) + '"></i>' +
                            '</div>' +
                            '<div class="playlist-details">' +
                                '<h3>' + pl.name + '</h3>' +
                                '<p>' + songCount + ' songs • ' + formatTime(totalDur) + ' • ' + pl.mood + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</li>';
                $list.append(html);
            });
        }

        $list.listview('refresh');
    }

    // ===== RENDER CREATE PLAYLIST SONG CHECKBOXES =====
    function renderSongCheckboxes() {
        var $group = $('#songCheckboxGroup');
        $group.empty();

        songs.forEach(function (song) {
            var html = '<input type="checkbox" name="playlistSongs" id="cb_' + song.id + '" value="' + song.id + '">' +
                '<label for="cb_' + song.id + '">' + song.title + ' — ' + song.artist + ' (' + formatTime(song.duration) + ')</label>';
            $group.append(html);
        });

        $group.enhanceWithin();
    }

    // ===== RENDER PLAYLIST DETAIL =====
    function renderPlaylistDetail(playlistId) {
        var pl = playlists.find(function (p) { return p.id === playlistId; });
        if (!pl) return;

        currentPlaylist = pl;
        currentQueueIds = pl.songIds.slice();

        $('#playlistDetailTitle').text(pl.name);

        // Header info
        var totalDur = 0;
        pl.songIds.forEach(function (sid) {
            var s = songs.find(function (song) { return song.id === sid; });
            if (s) totalDur += s.duration;
        });

        var moodColors = {
            'Energetic': '#ef4444', 'Chill': '#06b6d4', 'Romantic': '#ec4899',
            'Focus': '#8b5cf6', 'Party': '#eab308', 'Sad': '#6b7280', 'Motivational': '#10b981'
        };
        var moodColor = moodColors[pl.mood] || '#10b981';

        $('#playlistDetailInfo').html(
            '<div class="playlist-icon ' + getMoodClass(pl.mood) + '" style="width:64px;height:64px;border-radius:16px;font-size:1.5rem;margin:0 auto 12px;">' +
                '<i class="fas ' + getMoodIcon(pl.mood) + '"></i>' +
            '</div>' +
            '<h2>' + pl.name + '</h2>' +
            '<span class="pd-mood" style="background:' + moodColor + '20;color:' + moodColor + ';">' + pl.mood + '</span>' +
            (pl.description ? '<p class="pd-desc">' + pl.description + '</p>' : '') +
            '<p class="pd-stats">' + pl.songIds.length + ' songs • ' + formatTime(totalDur) + '</p>'
        );

        // Song list
        var $list = $('#playlistDetailList');
        $list.empty();

        if (pl.songIds.length === 0) {
            $list.hide();
            $('#emptyPlaylistDetail').show();
        } else {
            $('#emptyPlaylistDetail').hide();
            $list.show();

            pl.songIds.forEach(function (sid, idx) {
                var song = songs.find(function (s) { return s.id === sid; });
                if (!song) return;

                var isActive = nowPlaying && nowPlaying.id === song.id;
                var html = '<li data-song-id="' + song.id + '" data-filtertext="' + song.title + ' ' + song.artist + ' ' + song.genre + '">' +
                    '<a href="#" class="playlist-song-item">' +
                        '<div class="song-item-content">' +
                            '<div class="song-icon">' +
                                '<i class="fas ' + (isActive && isPlaying ? 'fa-volume-high' : 'fa-music') + '"></i>' +
                            '</div>' +
                            '<div class="song-details">' +
                                '<h3>' + song.title + '</h3>' +
                                '<p>' + song.artist + '</p>' +
                            '</div>' +
                            '<div class="song-meta">' +
                                '<span class="song-duration">' + formatTime(song.duration) + '</span>' +
                                '<br><span class="song-genre-tag">' + song.genre + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</li>';
                $list.append(html);
            });
        }

        $list.listview('refresh');
    }

    // ===== NOW PLAYING =====
    function playSong(songId) {
        var song = songs.find(function (s) { return s.id === songId; });
        if (!song) return;

        nowPlaying = song;
        isPlaying = true;
        currentTime = 0;
        Storage.set('bf_nowPlaying', song);

        updateNowPlayingUI();
        startPlayback();
        showToast('🎵 Now playing: ' + song.title);
    }

    function updateNowPlayingUI() {
        if (!nowPlaying) return;

        $('#npTitle').text(nowPlaying.title);
        $('#npArtist').text(nowPlaying.artist);
        $('#npAlbum').text(nowPlaying.album || '');
        $('#npTotalTime').text(formatTime(nowPlaying.duration));
        $('#npCurrentTime').text(formatTime(currentTime));

        var pct = nowPlaying.duration > 0 ? (currentTime / nowPlaying.duration) * 100 : 0;
        $('#npProgressFill').css('width', pct + '%');

        var $playBtn = $('#npPlayPause');
        if (isPlaying) {
            $playBtn.html('<i class="fas fa-pause"></i>');
            $('#npAlbumArt').addClass('playing');
        } else {
            $playBtn.html('<i class="fas fa-play"></i>');
            $('#npAlbumArt').removeClass('playing');
        }
    }

    function startPlayback() {
        clearInterval(playbackTimer);
        playbackTimer = setInterval(function () {
            if (isPlaying && nowPlaying) {
                currentTime++;
                if (currentTime >= nowPlaying.duration) {
                    // Song finished
                    if (isRepeat) {
                        currentTime = 0;
                    } else {
                        playNext();
                        return;
                    }
                }
                updateNowPlayingUI();
            }
        }, 1000);
    }

    function playNext() {
        if (currentQueueIds.length === 0) {
            // Use all songs as queue
            currentQueueIds = songs.map(function (s) { return s.id; });
        }

        if (!nowPlaying || currentQueueIds.length === 0) return;

        var currentIdx = currentQueueIds.indexOf(nowPlaying.id);

        if (isShuffle) {
            var randIdx = Math.floor(Math.random() * currentQueueIds.length);
            playSong(currentQueueIds[randIdx]);
        } else {
            var nextIdx = (currentIdx + 1) % currentQueueIds.length;
            playSong(currentQueueIds[nextIdx]);
        }
    }

    function playPrev() {
        if (currentQueueIds.length === 0) {
            currentQueueIds = songs.map(function (s) { return s.id; });
        }

        if (!nowPlaying || currentQueueIds.length === 0) return;

        var currentIdx = currentQueueIds.indexOf(nowPlaying.id);
        var prevIdx = (currentIdx - 1 + currentQueueIds.length) % currentQueueIds.length;
        playSong(currentQueueIds[prevIdx]);
    }

    // ===== EVENT HANDLERS =====

    // Song library click -> play
    $(document).on('click', '.song-list-item', function (e) {
        e.preventDefault();
        var songId = $(this).closest('li').data('song-id');
        currentQueueIds = songs.map(function (s) { return s.id; });
        playSong(songId);
        renderSongLibrary();
    });

    // Playlist song click -> play
    $(document).on('click', '.playlist-song-item', function (e) {
        e.preventDefault();
        var songId = $(this).closest('li').data('song-id');
        if (currentPlaylist) {
            currentQueueIds = currentPlaylist.songIds.slice();
        }
        playSong(songId);
        if (currentPlaylist) renderPlaylistDetail(currentPlaylist.id);
    });

    // Playlist list item click
    $(document).on('click', '.playlist-list-item', function (e) {
        var playlistId = $(this).closest('li').data('playlist-id');
        if (playlistId) {
            renderPlaylistDetail(playlistId);
        }
    });

    // Genre filter on home
    $(document).on('change', '#genreFilterHome', function () {
        renderSongLibrary();
    });

    // Play/Pause
    $('#npPlayPause').on('click', function (e) {
        e.preventDefault();
        if (!nowPlaying) return;
        isPlaying = !isPlaying;
        if (isPlaying) startPlayback();
        else clearInterval(playbackTimer);
        updateNowPlayingUI();
    });

    // Next / Prev
    $('#npNext').on('click', function (e) { e.preventDefault(); playNext(); });
    $('#npPrev').on('click', function (e) { e.preventDefault(); playPrev(); });

    // Shuffle
    $('#npShuffle').on('click', function (e) {
        e.preventDefault();
        isShuffle = !isShuffle;
        $(this).toggleClass('active', isShuffle);
        showToast(isShuffle ? 'Shuffle ON' : 'Shuffle OFF', 'info');
    });

    // Repeat
    $('#npRepeat').on('click', function (e) {
        e.preventDefault();
        isRepeat = !isRepeat;
        $(this).toggleClass('active', isRepeat);
        showToast(isRepeat ? 'Repeat ON' : 'Repeat OFF', 'info');
    });

    // Favorite
    $('#npFavorite').on('click', function (e) {
        e.preventDefault();
        var $icon = $(this).find('i');
        $icon.toggleClass('far fas');
        var isFav = $icon.hasClass('fas');
        showToast(isFav ? '❤️ Added to favorites' : 'Removed from favorites', 'info');
    });

    // ===== ADD SONG FORM =====
    $('#addSongForm').on('submit', function (e) {
        e.preventDefault();

        var newSong = {
            id: 's' + Date.now(),
            title: $('#songTitle').val().trim(),
            artist: $('#songArtist').val().trim(),
            album: $('#songAlbum').val().trim() || 'Unknown Album',
            genre: $('#songGenre').val(),
            duration: parseInt($('#songDuration').val()) || 0
        };

        if (!newSong.title || !newSong.artist || !newSong.duration) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        songs.push(newSong);
        Storage.set('bf_songs', songs);
        showToast('🎵 "' + newSong.title + '" added to library!');

        // Reset form
        this.reset();

        // Navigate back
        $.mobile.changePage('#homePage', { transition: 'slide', reverse: true });
    });

    // ===== CREATE PLAYLIST FORM =====
    $('#createPlaylistForm').on('submit', function (e) {
        e.preventDefault();

        var name = $('#playlistName').val().trim();
        if (!name) {
            showToast('Please enter a playlist name', 'error');
            return;
        }

        var selectedSongs = [];
        $('input[name="playlistSongs"]:checked').each(function () {
            selectedSongs.push($(this).val());
        });

        var newPlaylist = {
            id: 'p' + Date.now(),
            name: name,
            description: $('#playlistDesc').val().trim(),
            mood: $('#playlistMood').val(),
            songIds: selectedSongs,
            createdAt: Date.now()
        };

        playlists.push(newPlaylist);
        Storage.set('bf_playlists', playlists);
        showToast('🎉 Playlist "' + name + '" created!');

        // Reset form
        this.reset();
        $('input[name="playlistSongs"]').prop('checked', false).checkboxradio('refresh');

        // Navigate to playlists
        $.mobile.changePage('#playlistsPage', { transition: 'slide', reverse: true });
    });

    // ===== DELETE PLAYLIST =====
    $('#deletePlaylistBtn').on('click', function (e) {
        e.preventDefault();
        if (!currentPlaylist) return;
        if (!confirm('Delete playlist "' + currentPlaylist.name + '"?')) return;

        playlists = playlists.filter(function (p) { return p.id !== currentPlaylist.id; });
        Storage.set('bf_playlists', playlists);
        showToast('Playlist deleted', 'info');
        currentPlaylist = null;

        $.mobile.changePage('#playlistsPage', { transition: 'slide', reverse: true });
    });

    // ===== PAGE INIT EVENTS =====
    $(document).on('pagebeforeshow', '#homePage', function () {
        renderSongLibrary();
    });

    $(document).on('pagebeforeshow', '#playlistsPage', function () {
        renderPlaylists();
    });

    $(document).on('pagebeforeshow', '#createPlaylistPage', function () {
        renderSongCheckboxes();
    });

    $(document).on('pagebeforeshow', '#nowPlayingPage', function () {
        updateNowPlayingUI();
    });

    // ===== INITIAL RENDER =====
    renderSongLibrary();

    // Restore playback state
    if (nowPlaying) {
        updateNowPlayingUI();
    }
});
