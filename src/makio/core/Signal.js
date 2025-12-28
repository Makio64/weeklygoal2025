import DoubleLinkedList from '../utils/structures/DoubleLinkedList'
import ObjectPool from '../utils/structures/ObjectPool'

class SignalNode {
	constructor() {
		this.prev = null
		this.next = null
		this.listener = null
	}
}

export default class Signal {
	static POOL = new ObjectPool( () => new SignalNode(), 256 )

	constructor() {
		this.listeners = new DoubleLinkedList()
		this.listenersOnce = []
		this._listenerNodes = new WeakMap()
	}

	add( listener ) {
		// Prevent double-registration of the same listener
		if ( this._listenerNodes.has( listener ) ) {
			return
		}

		let node = Signal.POOL.get()
		node.listener = listener
		node.prev = null
		node.next = null
		
		this._listenerNodes.set( listener, node )

		this.listeners.add( node )
	}

	remove( listener ) {
		const node = this._listenerNodes.get( listener )
		if ( !node ) {
			return
		}
		this._listenerNodes.delete( listener )
		this.listeners.remove( node )
		node.listener = null
		Signal.POOL.release( node )
	}

	once( listener ) {
		this.addOnce( listener )
	}

	addOnce( listener ) {
		this.listenersOnce.push( listener )
	}

	dispatch() {
		const n = this.listenersOnce.length
		if ( n > 0 ) {
			for ( let i = 0; i < n; i++ ) {
				this.listenersOnce[i].apply( null, arguments )
			}
			this.listenersOnce = []
		}

		let node = this.listeners.root
		while ( node ) {
			const next = node.next
			if ( node.listener ) {
				node.listener.apply( null, arguments )
			}
			node = next
		}
	}

	dispose() {
		let node = this.listeners.root
		while ( node ) {
			const next = node.next
			node.listener = null
			node.prev = null
			node.next = null
			Signal.POOL.release( node )
			node = next
		}
		this.listeners = null
		this.listenersOnce = null
		this._listenerNodes = null
	}

	removeAll() {
		let node = this.listeners.root
		while ( node ) {
			const next = node.next
			node.listener = null
			node.prev = null
			node.next = null
			Signal.POOL.release( node )
			node = next
		}
		this.listeners.reset()
		this.listenersOnce = []
		this._listenerNodes = new WeakMap()
	}
}
