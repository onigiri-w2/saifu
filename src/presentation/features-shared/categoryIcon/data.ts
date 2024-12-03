import React from 'react';

import { SvgProps } from 'react-native-svg';

import AirplaneIcon from '@/assets/icons/phosphor/airplane.svg';
import AmazonLogoIcon from '@/assets/icons/phosphor/amazon-logo.svg';
import AndroidLogoIcon from '@/assets/icons/phosphor/android-logo.svg';
import AppleLogoIcon from '@/assets/icons/phosphor/apple-logo.svg';
import BeerSteinIcon from '@/assets/icons/phosphor/beer-stein.svg';
import BicycleIcon from '@/assets/icons/phosphor/bicycle.svg';
import BookIcon from '@/assets/icons/phosphor/book.svg';
import BreadIcon from '@/assets/icons/phosphor/bread.svg';
import BusIcon from '@/assets/icons/phosphor/bus.svg';
import CarIcon from '@/assets/icons/phosphor/car.svg';
import ChampagneIcon from '@/assets/icons/phosphor/champagne.svg';
import CoffeeIcon from '@/assets/icons/phosphor/coffee.svg';
import CookieIcon from '@/assets/icons/phosphor/cookie.svg';
import CookingPotIcon from '@/assets/icons/phosphor/cooking-pot.svg';
import DeviceMobileIcon from '@/assets/icons/phosphor/device-mobile.svg';
import DressIcon from '@/assets/icons/phosphor/dress.svg';
import DropIcon from '@/assets/icons/phosphor/drop.svg';
import DropboxLogoIcon from '@/assets/icons/phosphor/dropbox-logo.svg';
import FilmStripIcon from '@/assets/icons/phosphor/film-strip.svg';
import FireIcon from '@/assets/icons/phosphor/fire.svg';
import ForkIcon from '@/assets/icons/phosphor/fork.svg';
import GameControllerIcon from '@/assets/icons/phosphor/game-controller.svg';
import GarageIcon from '@/assets/icons/phosphor/garage.svg';
import GiftIcon from '@/assets/icons/phosphor/gift.svg';
import GithubLogoIcon from '@/assets/icons/phosphor/github-logo.svg';
import GlobeIcon from '@/assets/icons/phosphor/globe.svg';
import HamburgerIcon from '@/assets/icons/phosphor/hamburger.svg';
import HandSoapIcon from '@/assets/icons/phosphor/hand-soap.svg';
import HeadphonesIcon from '@/assets/icons/phosphor/headphones.svg';
import HospitalIcon from '@/assets/icons/phosphor/hospital.svg';
import HouseIcon from '@/assets/icons/phosphor/house.svg';
import LightningIcon from '@/assets/icons/phosphor/lightning.svg';
import MediumLogoIcon from '@/assets/icons/phosphor/medium-logo.svg';
import MotorcycleIcon from '@/assets/icons/phosphor/motorcycle.svg';
import NotionLogoIcon from '@/assets/icons/phosphor/notion-logo.svg';
import PantsIcon from '@/assets/icons/phosphor/pants.svg';
import PersonIcon from '@/assets/icons/phosphor/person.svg';
import PillIcon from '@/assets/icons/phosphor/pill.svg';
import PintGlassIcon from '@/assets/icons/phosphor/pint-glass.svg';
import PopcornIcon from '@/assets/icons/phosphor/popcorn.svg';
import ScissorsIcon from '@/assets/icons/phosphor/scissors.svg';
import ScooterIcon from '@/assets/icons/phosphor/scooter.svg';
import SlackLogoIcon from '@/assets/icons/phosphor/slack-logo.svg';
import SneakerIcon from '@/assets/icons/phosphor/sneaker.svg';
import SpotifyLogoIcon from '@/assets/icons/phosphor/spotify-logo.svg';
import SquareAIcon from '@/assets/icons/phosphor/square-letter-a.svg';
import SquareBIcon from '@/assets/icons/phosphor/square-letter-b.svg';
import SquareCIcon from '@/assets/icons/phosphor/square-letter-c.svg';
import SquareDIcon from '@/assets/icons/phosphor/square-letter-d.svg';
import SquareEIcon from '@/assets/icons/phosphor/square-letter-e.svg';
import SquareFIcon from '@/assets/icons/phosphor/square-letter-f.svg';
import SquareGIcon from '@/assets/icons/phosphor/square-letter-g.svg';
import SquareHIcon from '@/assets/icons/phosphor/square-letter-h.svg';
import SquareIIcon from '@/assets/icons/phosphor/square-letter-i.svg';
import SquareJIcon from '@/assets/icons/phosphor/square-letter-j.svg';
import SquareKIcon from '@/assets/icons/phosphor/square-letter-k.svg';
import SquareLIcon from '@/assets/icons/phosphor/square-letter-l.svg';
import SquareMIcon from '@/assets/icons/phosphor/square-letter-m.svg';
import SquareNIcon from '@/assets/icons/phosphor/square-letter-n.svg';
import SquareOIcon from '@/assets/icons/phosphor/square-letter-o.svg';
import SquarePIcon from '@/assets/icons/phosphor/square-letter-p.svg';
import SquareQIcon from '@/assets/icons/phosphor/square-letter-q.svg';
import SquareRIcon from '@/assets/icons/phosphor/square-letter-r.svg';
import SquareSIcon from '@/assets/icons/phosphor/square-letter-s.svg';
import SquareTIcon from '@/assets/icons/phosphor/square-letter-t.svg';
import SquareUIcon from '@/assets/icons/phosphor/square-letter-u.svg';
import SquareVIcon from '@/assets/icons/phosphor/square-letter-v.svg';
import SquareWIcon from '@/assets/icons/phosphor/square-letter-w.svg';
import SquareXIcon from '@/assets/icons/phosphor/square-letter-x.svg';
import SquareYIcon from '@/assets/icons/phosphor/square-letter-y.svg';
import SquareZIcon from '@/assets/icons/phosphor/square-letter-z.svg';
import StethoscopeIcon from '@/assets/icons/phosphor/stethoscope.svg';
import StudentIcon from '@/assets/icons/phosphor/student.svg';
import TShirtIcon from '@/assets/icons/phosphor/t-shirt.svg';
import TaxiIcon from '@/assets/icons/phosphor/taxi.svg';
import TipiIcon from '@/assets/icons/phosphor/tipi.svg';
import ToiletPaperIcon from '@/assets/icons/phosphor/toilet-paper.svg';
import ToothIcon from '@/assets/icons/phosphor/tooth.svg';
import TrainIcon from '@/assets/icons/phosphor/train.svg';
import TwitchLogoIcon from '@/assets/icons/phosphor/twitch-logo.svg';
import WashingMachineIcon from '@/assets/icons/phosphor/washing-machine.svg';
import WineIcon from '@/assets/icons/phosphor/wine.svg';
import XLogoIcon from '@/assets/icons/phosphor/x-logo.svg';
import YoutubeLogoIcon from '@/assets/icons/phosphor/youtube-logo.svg';
import { IconName } from '@/src/domain/aggregation/category/types/iconName';

const icons: Record<IconName, React.FC<SvgProps>> = {
  fork: ForkIcon,
  coffee: CoffeeIcon,
  'beer-stein': BeerSteinIcon,
  wine: WineIcon,
  'pint-glass': PintGlassIcon,
  champagne: ChampagneIcon,
  'cooking-pot': CookingPotIcon,
  hamburger: HamburgerIcon,
  bread: BreadIcon,
  cookie: CookieIcon,
  popcorn: PopcornIcon,
  car: CarIcon,
  taxi: TaxiIcon,
  train: TrainIcon,
  bus: BusIcon,
  bicycle: BicycleIcon,
  scooter: ScooterIcon,
  motorcycle: MotorcycleIcon,
  airplane: AirplaneIcon,
  house: HouseIcon,
  hospital: HospitalIcon,
  pill: PillIcon,
  garage: GarageIcon,
  person: PersonIcon,
  student: StudentIcon,
  stethoscope: StethoscopeIcon,
  tooth: ToothIcon,
  'washing-machine': WashingMachineIcon,
  scissors: ScissorsIcon,
  'toilet-paper': ToiletPaperIcon,
  drop: DropIcon,
  lightning: LightningIcon,
  fire: FireIcon,
  'device-mobile': DeviceMobileIcon,
  globe: GlobeIcon,
  't-shirt': TShirtIcon,
  dress: DressIcon,
  sneaker: SneakerIcon,
  pants: PantsIcon,
  gift: GiftIcon,
  tipi: TipiIcon,
  book: BookIcon,
  'film-strip': FilmStripIcon,
  'game-controller': GameControllerIcon,
  headphones: HeadphonesIcon,
  'hand-soap': HandSoapIcon,

  'amazon-logo': AmazonLogoIcon,
  'android-logo': AndroidLogoIcon,
  'apple-logo': AppleLogoIcon,
  'youtube-logo': YoutubeLogoIcon,
  'x-logo': XLogoIcon,
  'twitch-logo': TwitchLogoIcon,
  'notion-logo': NotionLogoIcon,
  'medium-logo': MediumLogoIcon,
  'dropbox-logo': DropboxLogoIcon,
  'github-logo': GithubLogoIcon,
  'spotify-logo': SpotifyLogoIcon,
  'slack-logo': SlackLogoIcon,

  'square-letter-a': SquareAIcon,
  'square-letter-b': SquareBIcon,
  'square-letter-c': SquareCIcon,
  'square-letter-d': SquareDIcon,
  'square-letter-e': SquareEIcon,
  'square-letter-f': SquareFIcon,
  'square-letter-g': SquareGIcon,
  'square-letter-h': SquareHIcon,
  'square-letter-i': SquareIIcon,
  'square-letter-j': SquareJIcon,
  'square-letter-k': SquareKIcon,
  'square-letter-l': SquareLIcon,
  'square-letter-m': SquareMIcon,
  'square-letter-n': SquareNIcon,
  'square-letter-o': SquareOIcon,
  'square-letter-p': SquarePIcon,
  'square-letter-q': SquareQIcon,
  'square-letter-r': SquareRIcon,
  'square-letter-s': SquareSIcon,
  'square-letter-t': SquareTIcon,
  'square-letter-u': SquareUIcon,
  'square-letter-v': SquareVIcon,
  'square-letter-w': SquareWIcon,
  'square-letter-x': SquareXIcon,
  'square-letter-y': SquareYIcon,
  'square-letter-z': SquareZIcon,
};

export default icons;
