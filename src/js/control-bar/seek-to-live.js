/**
 * @file seek-to-live.js
 */
import Button from '../button';
import Component from '../component';
import * as Dom from '../utils/dom.js';

/**
 * Displays the live indicator when duration is Infinity.
 *
 * @extends Component
 */
class SeekToLive extends Button {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);

    this.updateLiveEdgeStatus();
    this.on(this.player_.liveTracker, 'liveedgechange', this.updateLiveEdgeStatus);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-seek-to-live-control vjs-control'
    });

    this.textEl_ = Dom.createEl('span', {
      className: 'vjs-seek-to-live-text',
      innerHTML: this.localize('LIVE')
    }, {
      'aria-hidden': 'true'
    });

    this.circleEl_ = Dom.createEl('span', {
      className: 'vjs-seek-to-live-circle'
    });

    el.appendChild(this.circleEl_);
    el.appendChild(this.textEl_);
    return el;
  }

  /**
   * Update the state of this button if we are at the live edge
   * or not
   */
  updateLiveEdgeStatus(e) {
    if (this.player_.liveTracker.behindLiveEdge()) {
      this.setAttribute('aria-disabled', false);
      this.removeClass('vjs-at-live-edge');
      this.controlText('Seek To LIVE edge');
    } else {
      this.addClass('vjs-at-live-edge');
      this.controlText('At LIVE edge');
      this.setAttribute('aria-disabled', true);
    }
  }

  /**
   * On click bring us as near to the live point as possible.
   * This requires that we wait for the next `live-seekable-change`
   * event which will happen every segment length seconds.
   */
  handleClick() {
    this.player_.liveTracker.seekToLiveEdge();
  }

  /**
   * Dispose of the element and stop tracking
   */
  dispose() {
    this.off(this.player_.liveTracker, 'liveedgechange', this.updateLiveEdgeStatus);
    this.textEl_ = null;
    this.circleEl_ = null;

    super.dispose();
  }
}

SeekToLive.prototype.controlText_ = 'Seek to LIVE edge';

Component.registerComponent('SeekToLive', SeekToLive);
export default SeekToLive;
