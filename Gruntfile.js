module.exports = function(grunt) {
    // Load dev dependencies
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take for build time optimizations
    require('time-grunt')(grunt);

    // Configure the app path
    var base = 'app';

    var fbMessage = "";
    var launchFirebaseMessage = function (err, stdout, stderr, cb) {
        fbMessage = stdout;
        grunt.task.run([ 'shell:firebaseDeployMessage' ]);
        cb();
    };
    var getFirebaseCommandMessage = function() {
        var firstLine = fbMessage.split("\n")[0];
        return 'firebase deploy -m "' + firstLine + '"';
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowercopy: grunt.file.readJSON('bowercopy.json'),
        // The actual grunt server settings
        connect: {
            options: {
                port: 8000,
                livereload: 35728,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [ base ]
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [ base + '/js/*.js' ]
        },
        jsonlint: {
            pkg: [ 'package.json' ],
            bower: [ '{bower,bowercopy}.json' ]
        },
        watch: {
            // Watch javascript files for linting
            js: {
                files: [
                    '<%= jshint.all %>'
                ],
                tasks: ['jshint']
            },
            json: {
                files: [
                    '{package,bower}.json'
                ],
                tasks: ['jsonlint']
            },
            // Live reload
            reload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= watch.js.files %>',
                    '<%= watch.json.files %>',
                    base + '/css/**/*.css',
                    '**/*.html'
                ]
            }
        },
        shell: {
            firebaseDeploy: {
                command: 'firebase deploy'
            },
            firebaseDeployMessage: {
                command: getFirebaseCommandMessage
            },
            getRevAndFbD: {
                command: 'git log -1',
                options: {
                    callback: launchFirebaseMessage,
                    stdout: false,
                    stderr: false
                }
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma.conf.js',
                singleRun: true,
                autoWatch: false
            },
            tdd: {
                configFile: 'tests/karma.conf.js'
            }
        }
    });

    grunt.registerTask('serve', function () {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('deploy', function () {
        grunt.task.run([
            'bowercopy',
            'shell:firebaseDeploy'
        ]);
    });

    grunt.registerTask('deploym', function () {
        grunt.task.run([
            //'bowercopy',
            'shell:getRevAndFbD'
        ]);
    });


    grunt.registerTask('tdd', ['karma:tdd']);
    grunt.registerTask('unit', ['karma:unit']);

    grunt.registerTask('default', ['newer:jsonlint', 'newer:jshint', 'bowercopy', 'serve']);
};
