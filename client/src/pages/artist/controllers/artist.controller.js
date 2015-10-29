/**
 * Artist page controller
 */

export default class artistCtrl {
  /*@ngInject*/

  /**
   * @constructor
   * @param {artistModel} artistModel
   * @param {$rootScope.Scope} $scope
   * @param {ui.router.state.$stateParams} $stateParams
   * @param {ui.router.state.$state} $state
   */
  constructor(artistModel, $scope, $stateParams, $state) {
    if (angular.isDefined($stateParams.artistId) && $stateParams.artistId.length > 0) {
      this.artistId = $stateParams.artistId;
      this.model = artistModel;
      this.$scope = $scope;
      this.activeTab = 'songs';
      //Initialize data
      this.displaySongs = true;
      artistModel.getArtist(this.artistId, (artist) => {
        artistModel.getArtistsById(artist.artistInfo.similarArtistsList, (artists) => {
          this.similarArtists = artists;
        });
      });

    }
    else {
      $state.go('msl.home');
    }
  }
}
