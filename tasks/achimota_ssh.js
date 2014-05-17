/*
 * grunt-achimota-ssh
 * https://github.com/tawrahim/grunt-achimota-ssh.gitt
 *
 * Copyright (c) 2014 Tawheed Abdul-Raheem
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('achimota_ssh', 'This plugin coppies over any changed file to a remote server', function() {
    var Connection = require('ssh2');

    var options = this.options({
        host: '',
        username: '',
        password: '',
        port: 22,
        destination_path: ''
    });

    var c = new Connection();

    c.on('connect', function() {
      grunt.log.subhead('Achimota-SSH Connection :: ' + options.host);
    });

    c.on('ready', function() {
      grunt.log.ok('Achimota-SSH Connection :: ready');
      c.sftp(function(err, sftp) {
        if (err) {throw err;}
        sftp.on('end', function() {
          grunt.log.ok('Achimota-SSH Connection :: closed');
        });
        sftp.opendir(options.destination_path, function readdir(err, handle) {
          if (err) {throw err;}
          sftp.readdir(handle, function(err, list) {
            if (err) {throw err;}
            if (list === false) {
              sftp.close(handle, function(err) {
                if (err) {throw err;}
                grunt.log.ok('Achimota-SSH Connection :: closed');
                sftp.end();
              });
              return;
            }
            grunt.log.ok(list);
            readdir(undefined, handle);
          });
        });
      });
    });

    c.on('error', function(err) {
      grunt.log.error('Achimota-SSH Connection :: close');
      if (err) {throw err;}
    });

    c.on('close', function() {
      grunt.log.subhead('Achimota-SSH Connection :: close');
    });

    c.on('end', function() {
      grunt.log.subhead('Achimota-SSH Connection :: end');
    });

    c.connect(options);

  });

};
