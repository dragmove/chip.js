import Navi from './Navi';

class NaviHasTimer extends Navi {
	constructor(options) {
		super(options);

		this.timer = null;
		console.log( 'I has Timer.');
	}
}

export default NaviHasTimer;