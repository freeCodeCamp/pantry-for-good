import {
  default as mediaHelpers
} from './media-helpers.js'


describe('Media helpers', function() {
  context('node env = production', function() {
    const mediaRoot = 'dist/client/media'

    beforeEach(function() {
      mediaHelpers.__Rewire__('mediaRoot', mediaRoot)
    })

    afterEach(function() {
      mediaHelpers.__ResetDependency__('mediaRoot')
    })

    describe('getPath', function() {
      const getPath = mediaHelpers.__GetDependency__('getPath')

      it('should return pathname of production environment of type string given a valid filename', function() {
        const filename = 'testfile'
        const expected = mediaRoot + '/' + filename
        const actual = getPath(filename)

        expect(actual).to.contain(expected)
      })
    })		
  })

  context('node env = dev', function() {
    const mediaRoot = 'assets/media'

    beforeEach(function() {
      mediaHelpers.__Rewire__('mediaRoot', mediaRoot)
    })

    afterEach(function() {
      mediaHelpers.__ResetDependency__('mediaRoot')
    })		

    describe('getPath', function() {
      const getPath = mediaHelpers.__GetDependency__('getPath')
			
      it('should return pathname of dev environment', function() {
        const filename = 'testfile'
        const expected =  mediaRoot + '/' + filename
        const actual = getPath(filename)

        expect(actual).to.contain(expected)
      })
    })
  })
})