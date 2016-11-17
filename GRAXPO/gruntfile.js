
module.exports=function(grunt){
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      watch:{
         sass:{
            files:['sass/*.scss','sass/*/*.scss'],
            tasks:['sass','autoprefixer','cssmin'],
            options:{livereload:true}
         },
         typescript:{
            files:['js/*.ts'],
            tasks:['typescript'],
            options:{livereload:true} 
         }
      },

      cssmin:{
        my_target:{
            files:[{
              expand: true,
              cwd: 'css/resources/',
              src:['*.css','!*.min.css'],
              dest:'css/resources/',
              ext:'.min.css'
            }]
        }
      },
    
    sass:{
      dist:{
        files:{'css/resources/main.css':'sass/main.scss'}
      }
    },

    typescript: {
      base: {
        src: ['js/*.ts'],
        dest: 'js',
        options: {
          module: 'amd', //or commonjs 
          target: 'es5', //or es3 
          sourceMap: true,
          declaration: false
        }
      }
   },
  
    autoprefixer:{
        options: {
          browsers: ['last 95 versions', 'ie 8', 'ie 9']
        },
        single_file: {
          options: {
            // Target-specific options go here.
          },
          src: 'css/resources/main.css',
          dest: 'css/resources/main.css'
        },
       sourcemap: {
            options: {
                map: true
            }
        }
    }
    
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-typescript');
grunt.registerTask('default',['watch']);
}
