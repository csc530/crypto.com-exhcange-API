/*
__      __        _                                _               _
\ \    / / ___   | |__     ___     ___     __     | |__    ___    | |_
 \ \/\/ / / -_)  | '_ \   (_-<    / _ \   / _|    | / /   / -_)   |  _|
  \_/\_/  \___|  |_.__/   /__/_   \___/   \__|_   |_\_\   \___|   _\__|
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
   _               _                        _               _
  | |_    _  _    | |_     ___      _ _    (_)    __ _     | |
  |  _|  | +| |   |  _|   / _ \    | '_|   | |   / _` |    | |
  _\__|   \_,_|   _\__|   \___/   _|_|_   _|_|_  \__,_|   _|_|_
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'

A short
demo of
how a
websocket works
using the
`public/auth`
method
and heartbeat
in the
exchange API  

 #          #            #
# #      ## ### ### ### ###
###      #  # # # # #    #
# #     ##  # # ### #    ##
# #

  #                      ##
### ### ### ###     ###  #
# # ##  ### # #     # # ###
### ### # # ###     ###  #
                        ##

#
### ### # #      ##
# # # # ###     # #
# # ### ###     ###


        #               #        #                  #
# # ### ###  ## ### ### # # ### ###     # # ### ### # #  ##
### ##  # #  #  # # #   ##  ##   #      ### # # #   ##   #
### ### ### ##  ### ### # # ###  ##     ### ### #   # # ##


         #               #  #
# #  ##     ##  ###     ### ### ###
# #  #   #  # # # #      #  # # ##
### ##   ## # #  ##      ## # # ###
                ###

#           #    #   #        #          #  #   #
 #  ### # # ###  #      ###   #  ## # # ### ###  #
  # # # # # # #  #   #  #    #  # # # #  #  # #   #
    ### ### ###  ##  ## ### #   ### ###  ## # #
    #                       #

         #  #         #
### ### ### ### ### ###
### ##   #  # # # # # #
# # ###  ## # # ### ###


          #     #                #  #            #
 ## ##  ###     ### ###  ## ### ### ### ###  ## ###
# # # # # #     # # ##  # # #    #  # # ##  # #  #
### # # ###     # # ### ### #    ## ### ### ###  ##


 #           #  #
    ##      ### ### ###
 #  # #      #  # # ##
 ## # #      ## # # ###


            #                        #  ##  ###
### # # ### ###  ## ##  ### ###     # # # #  #
##   #  #   # # # # # # # # ##      ### ##   #
### # # ### # # ### # #  ## ###     # # #    #
                        ###         # # #   ###
*/

// Websocket package as no native websocket functionality comes with nodeJS
const ws = require('ws');
//Get the endpoint or 'URL' of the websocket to connect to
const endpoints = require('../../modules/endpoints.js');
const { objectToString } = require('../../modules/objToString');

// To open a web socket connection
//only enter the endpoint
/*
! Do not enter the parameter you would like to pass in after the enpoint
! like in a URL ex. https://wwwurl-enpoint.ca?p1=10&parameter2=aValueyou'dWouldLikeToBeSentWithHTTPRequest
*/
const websocket = new ws.WebSocket(endpoints.uat.websocket.user);
//Below are the handlers for each possible type of ws (websocket) response
//For each response we will simply print out its contents

/**Print the error if server responds with an error*/
websocket.on('error', err => {
	console.error(`Error: ${err}\n`);
});
/**When the websocket connection is established print the URL of the websocket (connection)*/
websocket.on('open', () => {
	console.log('opened websocket to -');
	console.log(websocket.url);
	console.log();
});
/**When the server sends a message/information back to us (usually JSON)
 * print out its contents*/
websocket.on('message', (msg, isbinary) => {
	console.log('Incoming msg (RAW):');
	console.log(msg + '\nBinary: ' + isbinary + '\n');
	const data = Object(JSON.parse(msg));
	//TODO: find out how to print out the obj like in con.dir()
	console.log('Message parsed: ');
	console.dir(data);
	console.log();
	//close the websocket connection
	websocket.close(/*exitCode, message to send b4 close*/);
});
/**When the connection is closed
 * print the status code we exited with*/
websocket.on('close', (code, reason) => {
	console.log('WebSocket closed');
	console.log(`Exit code: ${code}\nReason: ${reason}`);
});
