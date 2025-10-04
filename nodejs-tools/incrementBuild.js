import { execSync } from 'child_process'
import { existsSync } from 'fs'

const projectPath = 'ios/App/App.xcodeproj/project.pbxproj'

if ( !existsSync( projectPath ) ) {
	console.log( '⚠️  iOS project not found. Run "npx cap add ios" first.' )
	process.exit( 0 )
}

try {
	// Get current build number
	const currentBuild = execSync(
		`xcodebuild -project ios/App/App.xcodeproj -showBuildSettings | grep CURRENT_PROJECT_VERSION | awk '{print $3}' | head -1`,
		{ encoding: 'utf-8' },
	).trim()

	const newBuild = currentBuild ? parseInt( currentBuild ) + 1 : 1

	// Update build number using agvtool
	execSync( `cd ios/App && xcrun agvtool new-version -all ${newBuild}`, { stdio: 'inherit' } )

	console.log( `✅ iOS build number updated: ${currentBuild || '0'} → ${newBuild}` )
} catch ( error ) {
	console.error( '❌ Failed to increment build number:', error.message )
	process.exit( 1 )
}
