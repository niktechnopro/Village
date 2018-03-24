const date = new Date().toDateString();
$('#date').text(date); //today's date

// to confirm passwords
$('[name="relationship"]').on('focus', function () {
	let passw1 = $('[name="password1"]').val();
	let passw2 = $('[name="password2"]').val();
	if(passw2.length == 0 || passw1 !== passw2){
		console.log('problem with password')
		$('[name="password2"]').attr('type', 'text').css('color', 'red').val('passwords do not match');
		$('[name="password2"]').on('focus', function () {
			$('[name="password2"]').attr('type', 'password').css('color', 'black').val('');
		})
	};
});

// the above snippet to confirm password

		//pull login function
		//	Hides the items with class 'register-form' slowly 
		//	Shows the login form
		var pullLogin = () =>{
			$('.register-form').hide("slow");
			$('.guest-form').toggle(()=>{
				$('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow",()=>{
				console.log('produce register form');
			});
	   		// $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow",()=>{
	   		// 	console.log("now that effect has finished and callback function served we can move on")
	   		// 	});
				   
	   		});
		};
		//pull registration page function
		//	Hides the items with class 'guest-form' slowly 
		//	Hides the items with class 'register-form-2' slowly 
		//	Shows the registering form (first one)
		var pullRegistration = ()=>{
			$('.guest-form').hide('slow');
			$('.login-form').hide('slow');
			$('.guest-menu').animate({height: "58rem", top: "-7rem"}, "slow")
			$('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow",()=>{
				console.log('produce register form');
			});
		};
		

		//back to guest page
		//	Hides the items with class 'register-form' slowly 
		//	Hides the items with class 'register-form-2' slowly 
		//	Shows the guest form (first one)
		var toGuestPage = ()=>{
			$('.login-form').hide();
			$('.register-form').hide('slow');
			$('.guest-menu').animate({height: "48rem", top: "0"}, "slow")
			$('.guest-form').animate({height: "toggle", opacity: "toggle"}, "slow",()=>{
				console.log('welcome guest form has been served');
			});
		}



		//the following are just the listeners
		// to pull login page
    	$('.login_page').click(()=>{
    		pullLogin();
    		console.log("login form will be produced")
    	});
		
		// to pull registration page
		$('.register_page').click(function(){
			pullRegistration();
			console.log("registration form should've been produced by now");
		});
		

		// back to guest page button
		$('.guest_page').click(()=>{
			toGuestPage();
			console.log('back to guest page');
		})

		$('.exit-logo').click(()=>{
			console.log('back to guest page');
			$('.login-form').hide();
			$('.register-form').hide('slow');
			$('.guest-menu').animate({height: "48rem", top: "0"}, "slow")
			$('.guest-form').show('slow');
			// $('.guest-form').animate({height: "toggle", opacity: "toggle"}, "slow",()=>{
			// 	console.log('welcome guest form has been served');
			// });
		})

		$(document).ready(()=>{
			if (onLoad == 1) {
    		swal({
  				title: "Your email is already in database",
  				text: "Check Password and Try Again",
  				button: "Thank you!",
			}).then(()=>{
				pullLogin();
			});
			}else if(onLoad == 2){
				swal({
  				title: "Hmm, Can't find this email!",
  				text: "Please proceed with registration",
  				button: "Thank you!",
			}).then(()=>{
				pullRegistration();
				});
			}
		})

		//Prevents the user from scrolling.
		var scrollEventHandler = function(){
  				window.scroll(0, window.pageYOffset)
		}
		window.addEventListener("scroll", scrollEventHandler, false);